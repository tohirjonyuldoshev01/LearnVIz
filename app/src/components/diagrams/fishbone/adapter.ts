import { DiagramContent } from '@/types';
import { FishboneBone, FishboneModel, FishboneSubCause } from './types';

const LEGACY_KEYS = ['people', 'process', 'materials', 'environment', 'methods'] as const;

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const toSubCauses = (value: string | string[] | undefined): FishboneSubCause[] => {
  if (!value) return [];
  const lines = Array.isArray(value) ? value : value.split('\n');
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ id: uid('sub'), text: line }));
};

export const createDefaultFishboneModel = (): FishboneModel => ({
  effect: '',
  bones: [
    { id: uid('bone'), label: 'People', side: 'top', angle: -32, subCauses: [] },
    { id: uid('bone'), label: 'Process', side: 'bottom', angle: 32, subCauses: [] },
    { id: uid('bone'), label: 'Materials', side: 'top', angle: -36, subCauses: [] },
    { id: uid('bone'), label: 'Environment', side: 'bottom', angle: 36, subCauses: [] },
    { id: uid('bone'), label: 'Methods', side: 'top', angle: -40, subCauses: [] },
  ],
});

export const deserializeFishboneContent = (content: DiagramContent): FishboneModel => {
  const rawModel = content.fishboneModel;

  if (typeof rawModel === 'string' && rawModel.trim()) {
    try {
      const parsed = JSON.parse(rawModel) as FishboneModel;
      if (parsed && Array.isArray(parsed.bones)) {
        return {
          effect: parsed.effect || (typeof content.problem === 'string' ? content.problem : ''),
          bones: parsed.bones.map((bone, index) => ({
            id: bone.id || uid('bone'),
            label: bone.label || `Category ${index + 1}`,
            side: bone.side === 'bottom' ? 'bottom' : 'top',
            angle:
              typeof bone.angle === 'number'
                ? bone.angle
                : bone.side === 'bottom'
                ? 34
                : -34,
            manualDx: bone.manualDx || 0,
            manualDy: bone.manualDy || 0,
            subCauses: Array.isArray(bone.subCauses)
              ? bone.subCauses.map((sub) => ({
                  id: sub.id || uid('sub'),
                  text: sub.text || '',
                }))
              : [],
          })),
        };
      }
    } catch {
      // Fallback to legacy conversion
    }
  }

  const effect = typeof content.problem === 'string' ? content.problem : '';
  const legacyBones: FishboneBone[] = LEGACY_KEYS.map((key, index) => ({
    id: uid('bone'),
    label: key[0].toUpperCase() + key.slice(1),
    side: index % 2 === 0 ? 'top' : 'bottom',
    angle: index % 2 === 0 ? -34 : 34,
    subCauses: toSubCauses(content[key]),
  }));

  return {
    effect,
    bones: legacyBones,
  };
};

export const serializeFishboneContent = (
  model: FishboneModel,
  previous: DiagramContent
): DiagramContent => {
  const merged: DiagramContent = {
    ...previous,
    problem: model.effect,
    fishboneModel: JSON.stringify(model),
  };

  model.bones.forEach((bone, index) => {
    const key = LEGACY_KEYS[index];
    if (key) {
      merged[key] = bone.subCauses.map((sub) => sub.text).join('\n');
    }
  });

  return merged;
};

export const getNextBoneSide = (bones: FishboneBone[]) => {
  const top = bones.filter((bone) => bone.side === 'top').length;
  const bottom = bones.filter((bone) => bone.side === 'bottom').length;
  return top <= bottom ? 'top' : 'bottom';
};

export const createBone = (label: string, side: 'top' | 'bottom', order: number): FishboneBone => ({
  id: uid('bone'),
  label,
  side,
  angle: side === 'top' ? -(30 + (order % 3) * 4) : 30 + (order % 3) * 4,
  subCauses: [{ id: uid('sub'), text: 'New sub-cause' }],
});

export const createSubCause = (): FishboneSubCause => ({
  id: uid('sub'),
  text: 'New sub-cause',
});
