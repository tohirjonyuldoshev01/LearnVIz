import { NextRequest, NextResponse } from 'next/server';
import { EvaluationRequest, EvaluationResponse, ScoreBreakdown } from '@/types';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ---------------------------------------------------------------------------
// Rate limiter – simple sliding-window per IP (in-memory, resets on restart)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;   // max requests per window

interface RateLimitEntry { timestamps: number[] }
const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(ip, entry);
  }
  // Evict timestamps older than the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (entry.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.timestamps.push(now);
  return false;
}

// Cleanup stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (entry.timestamps.length === 0) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// ---------------------------------------------------------------------------
// Input sanitization & prompt-injection protection
// ---------------------------------------------------------------------------
const MAX_TOPIC_LENGTH = 500;
const MAX_CONTENT_JSON_LENGTH = 50_000; // ~50 KB cap on serialized content

/** Strip characters & patterns that could tamper with AI prompts */
function sanitizeText(text: string): string {
  return text
    // Remove zero-width & control chars (except newline/tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    .trim();
}

/** Detect common prompt-injection patterns in user-supplied strings */
function containsPromptInjection(text: string): boolean {
  const lower = text.toLowerCase();
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/,
    /disregard\s+(all\s+)?previous/,
    /forget\s+(all\s+)?prior/,
    /you\s+are\s+now\s+a/,
    /system\s*:\s*/,
    /\bact\s+as\b.*\b(admin|root|developer)\b/,
    /override\s+(the\s+)?system/,
    /reveal\s+(your|the)\s+(system|secret|api)/,
    /do\s+not\s+follow\s+(the\s+)?instructions/,
  ];
  return patterns.some((p) => p.test(lower));
}

/** Recursively sanitize all string values in diagram content */
function sanitizeContent(obj: unknown): unknown {
  if (typeof obj === 'string') return sanitizeText(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeContent);
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[sanitizeText(key)] = sanitizeContent(value);
    }
    return result;
  }
  return obj;
}

// ---------------------------------------------------------------------------
// JSON extraction helper
// ---------------------------------------------------------------------------
function extractJSON(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text.trim();
}

// ---------------------------------------------------------------------------
// AI response structure validation
// ---------------------------------------------------------------------------
function validateEvaluationData(data: any): string | null {
  if (typeof data.total_score !== 'number' || data.total_score < 0 || data.total_score > 100) {
    return 'total_score must be a number between 0 and 100';
  }
  if (!data.breakdown || typeof data.breakdown !== 'object') {
    return 'missing breakdown object';
  }
  const expectedKeys: Array<{ key: string; max: number }> = [
    { key: 'structure', max: 20 },
    { key: 'content_quality', max: 30 },
    { key: 'relevance', max: 20 },
    { key: 'critical_thinking', max: 20 },
    { key: 'clarity', max: 10 },
  ];
  for (const { key, max } of expectedKeys) {
    const val = data.breakdown[key];
    if (typeof val !== 'number' || val < 0 || val > max) {
      return `breakdown.${key} must be a number between 0 and ${max}`;
    }
  }
  for (const field of ['strengths', 'improvements', 'suggestions']) {
    if (data[field] !== undefined && typeof data[field] !== 'string') {
      return `${field} must be a string`;
    }
  }
  return null; // valid
}

// Common Uzbek words used for language detection
const UZBEK_WORDS = new Set([
  // function words
  'va', 'bu', 'bir', 'uchun', 'bilan', 'kerak', 'emas',
  'ham', 'yoki', 'lekin', 'chunki', 'qanday', 'nima', 'har', 'eng',
  'shu', 'shunday', 'bunday', 'hamma', 'barcha', 'boshqa',
  'agar', 'balki', 'albatta', 'haqida', 'orqali', 'tufayli',
  // common adjectives/adverbs
  'katta', 'kichik', 'yaxshi', 'yomon', 'yangi', 'eski',
  'ko\'p', 'kam', 'tez', 'sekin', 'oson', 'qiyin', 'muhim',
  // time/place
  'oldin', 'keyin', 'hozir', 'qachon', 'qayerda', 'yerda',
  // verbs (common stems)
  'qilish', 'berish', 'olish', 'borish', 'kelish', 'ko\'rish',
  'yozish', 'bilish', 'aytish', 'ishlash', 'o\'qish', 'tushunish',
  // educational / diagram words
  'mavzu', 'sabab', 'natija', 'tahlil', 'kuchli', 'zaif',
  'imkoniyat', 'xavf', 'jarayon', 'bosqich', 'tushuncha',
  'aloqa', 'muhit', 'usul', 'masala', 'yechim', 'maqsad',
  'reja', 'narsa', 'tomonlar', 'sabablar', 'kategoriya',
  'diagramma', 'xarita', 'jadval', 'vaqt', 'misol',
  'bilim', 'fan', 'tomon', 'jihat', 'daraja',
  'daraxt', 'suv', 'havo', 'yer', 'tabiat', 'hayot',
  'odam', 'bolalar', 'maktab', 'sinf', 'kitob',
  // more connectors
  'sababli', 'natijada', 'shuning', 'masalan', 'demak',
  'birinchidan', 'ikkinchidan', 'uchinchidan',
]);

// Uzbek-specific suffixes that rarely appear in English
const UZBEK_SUFFIXES = [
  'lar', 'lik', 'chi', 'ning', 'dan', 'dagi', 'lari',
  'ishi', 'lash', 'lan', 'siz', 'cha', 'dir', 'miz',
  'ngiz', 'lar', 'ini', 'iga', 'ida', 'idan',
];

/**
 * Detect whether the input text is predominantly Uzbek or English.
 * Uses three signals: Uzbek apostrophe patterns, known words, and suffix matching.
 * Returns 'uz' or 'en'.
 */
function detectLanguage(topic: string, content: unknown): 'uz' | 'en' {
  const texts: string[] = [topic];

  function collectStrings(obj: unknown) {
    if (typeof obj === 'string') {
      texts.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(collectStrings);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj as Record<string, unknown>).forEach(collectStrings);
    }
  }
  collectStrings(content);

  const allText = texts.join(' ');
  const lowerText = allText.toLowerCase();

  // Signal 1: Uzbek apostrophe patterns (o' g' sh ch are characteristic)
  // o' or oʻ followed by a letter — almost never occurs in English
  const uzApostropheCount =
    (lowerText.match(/[og]['ʻʼ\u02BB\u02BC][a-z]/g) || []).length;

  // Signal 2: Word matching against known Uzbek vocabulary
  const words = lowerText
    .replace(/[^a-zA-Z\u02BB\u02BC\u2018\u2019']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (words.length === 0) return 'en';

  let uzWordCount = 0;
  let uzSuffixCount = 0;

  for (const word of words) {
    const normalized = word.replace(/[\u02BB\u02BC\u2018\u2019']/g, '\'');
    if (UZBEK_WORDS.has(normalized)) {
      uzWordCount++;
    }
    // Signal 3: Check for Uzbek suffixes on longer words
    if (normalized.length >= 4) {
      for (const suffix of UZBEK_SUFFIXES) {
        if (normalized.endsWith(suffix)) {
          uzSuffixCount++;
          break;
        }
      }
    }
  }

  // Combine signals for a robust score
  const totalSignals = uzWordCount + uzSuffixCount + uzApostropheCount * 2;
  const signalRatio = totalSignals / words.length;

  // If we have strong apostrophe evidence (o'z, g'oya, etc.), very likely Uzbek
  if (uzApostropheCount >= 2) return 'uz';
  // Even 1 apostrophe pattern + some word/suffix matches
  if (uzApostropheCount >= 1 && (uzWordCount + uzSuffixCount) >= 1) return 'uz';
  // Enough combined signals without apostrophes
  if (signalRatio > 0.1) return 'uz';
  // At least a few definite Uzbek words in short input
  if (uzWordCount >= 3) return 'uz';

  return 'en';
}

const EVALUATION_PROMPTS: Record<string, string> = {
  swot: `You are an expert educational evaluator. Analyze this SWOT analysis for the topic and provide detailed feedback.
  
Evaluate the following criteria:
- Structure (20%): Does it follow the SWOT format (Strengths, Weaknesses, Opportunities, Threats)?
- Content Quality (30%): Are the points substantive, clear, and well-articulated?
- Relevance (20%): Are all points relevant to the topic?
- Critical Thinking (20%): Does it show depth of analysis and understanding?
- Clarity (10%): Is the writing clear and understandable?

Return a JSON object with your evaluation.`,
  
  fishbone: `You are an expert educational evaluator. Analyze this Fishbone (Cause-Effect) diagram for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Does it properly identify the main problem and organize causes into categories (people, process, materials, environment, methods)?
- Content Quality (30%): Are the causes and effects substantive and well-explained?
- Relevance (20%): Are all identified causes truly relevant to the problem?
- Critical Thinking (20%): Does it show deeper causal analysis and understanding?
- Clarity (10%): Is the presentation clear and easy to follow?

Return a JSON object with your evaluation.`,
  
  venn: `You are an expert educational evaluator. Analyze this Venn diagram for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Are there clear unique and common elements between the sets?
- Content Quality (30%): Are the comparisons substantive and well-chosen?
- Relevance (20%): Are all elements truly relevant to the comparison?
- Critical Thinking (20%): Does it show thoughtful analysis of relationships?
- Clarity (10%): Is the distinction between unique and common elements clear?

Return a JSON object with your evaluation.`,
  
  mindmap: `You are an expert educational evaluator. Analyze this Mind Map for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Is there a clear central idea with main branches and sub-branches?
- Content Quality (30%): Are the branches substantive and well-developed?
- Relevance (20%): Does everything relate to the central idea?
- Critical Thinking (20%): Is there good hierarchical organization and depth?
- Clarity (10%): Is the relationship between ideas clear?

Return a JSON object with your evaluation.`,
  
  flowchart: `You are an expert educational evaluator. Analyze this Flowchart for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Does it follow proper flowchart logic (start, process, decision, output, end)?
- Content Quality (30%): Are the steps clear, accurate, and well-sequenced?
- Relevance (20%): Are all steps necessary for the process?
- Critical Thinking (20%): Does it demonstrate understanding of the process flow?
- Clarity (10%): Is the flow easy to follow?

Return a JSON object with your evaluation.`,
  
  timeline: `You are an expert educational evaluator. Analyze this Timeline for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Are events properly sequenced chronologically?
- Content Quality (30%): Are the events significant and well-described?
- Relevance (20%): Are all events relevant to the topic?
- Critical Thinking (20%): Does it show understanding of cause-and-effect in history?
- Clarity (10%): Is the progression clear and easy to understand?

Return a JSON object with your evaluation.`,
  
  pyramid: `You are an expert educational evaluator. Analyze this Pyramid diagram for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Is there a clear hierarchical organization from top to bottom?
- Content Quality (30%): Are the levels substantive and logically ordered?
- Relevance (20%): Does each level contribute to the overall concept?
- Critical Thinking (20%): Does it demonstrate understanding of hierarchy or priority?
- Clarity (10%): Is the importance/order of levels clear?

Return a JSON object with your evaluation.`,
  
  causeeffect: `You are an expert educational evaluator. Analyze this Cause-Effect Matrix for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Does it properly show causes, effects, and their correlations?
- Content Quality (30%): Are the relationships substantive and well-explained?
- Relevance (20%): Are all causes and effects relevant?
- Critical Thinking (20%): Does it demonstrate understanding of complex relationships?
- Clarity (10%): Is the correlation between causes and effects clear?

Return a JSON object with your evaluation.`,
  
  conceptmap: `You are an expert educational evaluator. Analyze this Concept Map for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Are concepts and relationships clearly connected?
- Content Quality (30%): Are the concepts substantive and relationships well-articulated?
- Relevance (20%): Are all concepts relevant to the topic?
- Critical Thinking (20%): Does it show understanding of knowledge relationships?
- Clarity (10%): Is the map easy to read and understand?

Return a JSON object with your evaluation.`,
  
  tchart: `You are an expert educational evaluator. Analyze this T-Chart for the topic and provide detailed feedback.

Evaluate the following criteria:
- Structure (20%): Are both sides clearly delineated and organized?
- Content Quality (30%): Are the items substantive and well-chosen?
- Relevance (20%): Are all items relevant to their respective sides?
- Critical Thinking (20%): Does the comparison show thoughtful analysis?
- Clarity (10%): Is the distinction between sides clear?

Return a JSON object with your evaluation.`,
};

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting ---
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    const body: EvaluationRequest = await request.json();
    const { topic: rawTopic, diagramType, content: rawContent, educationLevel = 'high' } = body;

    if (!rawTopic || !diagramType || !rawContent) {
      return NextResponse.json(
        { success: false, error: 'Topic, diagram type, and content are required' },
        { status: 400 }
      );
    }

    if (!EVALUATION_PROMPTS[diagramType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid diagram type' },
        { status: 400 }
      );
    }

    // --- Input sanitization ---
    const topic = sanitizeText(rawTopic).slice(0, MAX_TOPIC_LENGTH);
    const content = sanitizeContent(rawContent) as typeof rawContent;

    // --- Content size guard ---
    const contentJson = JSON.stringify(content);
    if (contentJson.length > MAX_CONTENT_JSON_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Diagram content is too large to evaluate. Please reduce the amount of text.' },
        { status: 413 }
      );
    }

    // --- Prompt injection protection ---
    const allText = topic + ' ' + contentJson;
    if (containsPromptInjection(allText)) {
      return NextResponse.json(
        { success: false, error: 'Input contains disallowed patterns. Please revise your content.' },
        { status: 400 }
      );
    }

    const educationLevelText = {
      primary: 'primary school level',
      middle: 'middle school level',
      high: 'high school level',
      college: 'college level',
    }[educationLevel as string] || 'high school level';

    const contentDescription = JSON.stringify(content, null, 2);

    // Detect input language
    const detectedLang = detectLanguage(topic, content);
    console.log(`[Evaluate] Detected language: ${detectedLang} for topic: "${topic}"`);

    const langName = detectedLang === 'uz' ? 'Uzbek' : 'English';

    const languageInstruction = detectedLang === 'uz'
      ? `CRITICAL LANGUAGE RULE: The student wrote in Uzbek. You MUST respond ENTIRELY in Uzbek.
Every single text value in the JSON (strengths, improvements, suggestions) MUST be written in simple, natural, conversational Uzbek that a school pupil can understand.
Do NOT use any English words in these fields. Do NOT mix languages. Only Uzbek text is allowed.`
      : `CRITICAL LANGUAGE RULE: The student wrote in English. You MUST respond ENTIRELY in English.
Every single text value in the JSON (strengths, improvements, suggestions) MUST be written in clear, simple, student-friendly English.`;

    const prompt = `You are an expert educational evaluator specialized in visual learning tools.
    
Topic: "${topic}"
Education Level: ${educationLevelText}

Student's Diagram Content:
${contentDescription}

${EVALUATION_PROMPTS[diagramType]}

Scoring Guidelines:
- Structure (20%): Format compliance and organization
- Content Quality (30%): Depth, accuracy, and substantiveness
- Relevance (20%): Topic alignment and appropriateness
- Critical Thinking (20%): Analysis depth and understanding
- Clarity (10%): Communication and readability

${languageInstruction}

Based on this evaluation, return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure.
REMEMBER: "strengths", "improvements", and "suggestions" values MUST be in ${langName} language only!
{
  "total_score": <number 0-100>,
  "breakdown": {
    "structure": <number 0-20>,
    "content_quality": <number 0-30>,
    "relevance": <number 0-20>,
    "critical_thinking": <number 0-20>,
    "clarity": <number 0-10>
  },
  "strengths": "<${langName} string listing 2-3 main strengths>",
  "improvements": "<${langName} string listing 2-3 areas for improvement>",
  "suggestions": "<${langName} string with 2-3 actionable suggestions>"
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: detectedLang === 'uz'
                ? 'You are an educational evaluator. You MUST write all text responses in Uzbek language (O\'zbek tili). Never use English in your text outputs.'
                : 'You are an educational evaluator. You MUST write all text responses in English. Never use other languages in your text outputs.',
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nReturn ONLY valid JSON. All text values MUST be in ${langName}.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json().catch(() => null);
      console.error('Gemini evaluate error:', errorBody || geminiResponse.statusText);
      return NextResponse.json(
        {
          success: false,
          error:
            errorBody?.error?.message || 'Failed to evaluate content from Gemini',
        },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    const messageContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!messageContent) {
      return NextResponse.json(
        { success: false, error: 'Failed to evaluate content' },
        { status: 500 }
      );
    }

    let evaluationData: any;
    try {
      evaluationData = JSON.parse(extractJSON(messageContent));
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', messageContent);
      return NextResponse.json(
        { success: false, error: 'Failed to parse evaluation response' },
        { status: 500 }
      );
    }

    // Validate the response structure
    const validationError = validateEvaluationData(evaluationData);
    if (validationError) {
      console.error('AI response validation failed:', validationError, evaluationData);
      return NextResponse.json(
        { success: false, error: 'Invalid evaluation response format' },
        { status: 500 }
      );
    }

    const result: EvaluationResponse = {
      success: true,
      total_score: Math.round(evaluationData.total_score),
      breakdown: {
        structure: Math.round(evaluationData.breakdown.structure),
        content_quality: Math.round(evaluationData.breakdown.content_quality),
        relevance: Math.round(evaluationData.breakdown.relevance),
        critical_thinking: Math.round(evaluationData.breakdown.critical_thinking),
        clarity: Math.round(evaluationData.breakdown.clarity),
      },
      strengths: evaluationData.strengths || '',
      improvements: evaluationData.improvements || '',
      suggestions: evaluationData.suggestions || '',
      detectedLanguage: detectedLang,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Evaluation Error:', error?.response?.data || error);
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to evaluate content';
    return NextResponse.json(
      {
        success: false,
        error:
          message === 'Incorrect API key provided'
            ? 'Invalid Gemini API key. Please check your Google AI Studio dashboard.'
            : message,
      },
      { status: 500 }
    );
  }
}
