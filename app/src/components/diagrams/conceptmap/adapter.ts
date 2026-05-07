import { DiagramContent } from '@/types';
import { ConceptMapModel, ConceptNode, ConceptConnection } from './types';

let counter = 0;
const uid = () => `cm_${Date.now()}_${++counter}`;

const COLORS_COUNT = 8;

export function createNode(text: string, x: number, y: number, colorIndex?: number): ConceptNode {
  return {
    id: uid(),
    text,
    x,
    y,
    colorIndex: colorIndex ?? Math.floor(Math.random() * COLORS_COUNT),
  };
}

export function createConnection(fromId: string, toId: string, label = ''): ConceptConnection {
  return { id: uid(), fromId, toId, label };
}

export function createDefaultModel(): ConceptMapModel {
  return {
    nodes: [createNode('Main Concept', 600, 280, 0)],
    connections: [],
  };
}

export function deserializeContent(content: DiagramContent): ConceptMapModel {
  if (content.conceptMapModel && typeof content.conceptMapModel === 'string') {
    try {
      const parsed = JSON.parse(content.conceptMapModel);
      if (parsed.nodes && parsed.connections) return parsed;
    } catch {
      /* fall through to migration */
    }
  }

  const c1 = (content.concept1 as string) || '';
  const c2 = (content.concept2 as string) || '';
  const rel = (content.relationship as string) || '';
  const det = (content.details as string) || '';

  if (!c1 && !c2) return createDefaultModel();

  const node1 = createNode(c1 || 'Concept 1', 380, 280, 0);
  const node2 = createNode(c2 || 'Concept 2', 820, 280, 1);
  const nodes: ConceptNode[] = [node1, node2];
  const connections: ConceptConnection[] = [];

  if (c1 || c2) {
    connections.push(createConnection(node1.id, node2.id, rel));
  }

  if (det) {
    const node3 = createNode(det, 600, 460, 3);
    nodes.push(node3);
  }

  return { nodes, connections };
}

export function serializeContent(model: ConceptMapModel, prev: DiagramContent): DiagramContent {
  const result: DiagramContent = { ...prev };

  result.conceptMapModel = JSON.stringify(model);

  // Keep flat fields in sync for backward compat (evaluation, etc.)
  result.concept1 = model.nodes[0]?.text || '';
  result.concept2 = model.nodes[1]?.text || '';
  result.relationship = model.connections[0]?.label || '';
  result.details = model.nodes
    .slice(2)
    .map((n) => n.text)
    .filter(Boolean)
    .join('; ');

  return result;
}
