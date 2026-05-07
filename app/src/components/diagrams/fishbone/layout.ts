import {
  FishboneBone,
  FishboneBoneLayout,
  FishboneLayout,
  FishboneModel,
  Point,
} from './types';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const FIXED_TOP_ANGLE = -45;
const FIXED_BOTTOM_ANGLE = 45;

const polar = (origin: Point, length: number, angleDeg: number): Point => {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: origin.x + Math.cos(angle) * length,
    y: origin.y + Math.sin(angle) * length,
  };
};

const distribute = (bones: FishboneBone[]) => {
  const top = bones.filter((bone) => bone.side === 'top');
  const bottom = bones.filter((bone) => bone.side === 'bottom');
  return { top, bottom };
};

const computeWeightedAnchors = (bones: FishboneBone[], startX: number, endX: number) => {
  if (bones.length === 0) return [] as number[];

  const baseWeight = 1.1;
  const weights = bones.map((bone) => baseWeight + Math.min(bone.subCauses.length, 6) * 0.24);
  const sum = weights.reduce((acc, value) => acc + value, 0);

  let cursor = startX;
  return weights.map((weight) => {
    const segment = ((endX - startX) * weight) / sum;
    const x = cursor + segment / 2;
    cursor += segment;
    return x;
  });
};

const createSideLayouts = (
  sideBones: FishboneBone[],
  side: 'top' | 'bottom',
  spineStartX: number,
  spineEndX: number,
  centerY: number,
  width: number,
  height: number
): FishboneBoneLayout[] => {
  const usableStart = spineStartX + width * 0.1;
  const usableEnd = spineEndX - width * 0.11;
  const layouts: FishboneBoneLayout[] = [];
  const placedLabels: Point[] = [];
  const anchors = computeWeightedAnchors(sideBones, usableStart, usableEnd);

  sideBones.forEach((bone, index) => {
    const baseX = anchors[index] ?? usableStart;
    const base: Point = {
      x: baseX + (bone.manualDx || 0),
      y: centerY + (bone.manualDy || 0),
    };

    const densityFactor = Math.min(sideBones.length / 8, 0.4);
    const rawLength = clamp(height * (0.30 - densityFactor * 0.08) - index * 2, 110, 210);
    // Control point for quadratic curve to make it look like ribs curving to the left
    const controlPoint = {
      x: base.x - rawLength * 0.15,
      y: side === 'top' ? base.y - rawLength * 0.6 : base.y + rawLength * 0.6,
    };
    const end = {
      x: base.x - rawLength * 0.6,
      y: side === 'top' ? base.y - rawLength : base.y + rawLength,
    };

    let label: Point = {
      x: end.x,
      y: end.y + (side === 'top' ? -20 : 30),
    };

    const minDistance = 42;
    for (let i = 0; i < placedLabels.length; i += 1) {
      const prev = placedLabels[i];
      const dy = Math.abs(prev.y - label.y);
      const dx = Math.abs(prev.x - label.x);
      if (dy < minDistance && dx < 150) {
        label = {
          ...label,
          y: label.y + (side === 'top' ? -1 : 1) * (minDistance - dy + 6),
          x: label.x + (label.x >= prev.x ? 1 : -1) * 6,
        };
      }
    }
    placedLabels.push(label);

    const subCount = Math.max(bone.subCauses.length, 1);
    const subBones = bone.subCauses.map((sub, subIndex) => {
      // Points along quadratic bezier
      const t = (subIndex + 1) / (subCount + 1);
      const anchor: Point = {
        x: (1 - t) * (1 - t) * base.x + 2 * (1 - t) * t * controlPoint.x + t * t * end.x,
        y: (1 - t) * (1 - t) * base.y + 2 * (1 - t) * t * controlPoint.y + t * t * end.y,
      };

      const subLength = clamp(48 + subIndex * 3, 40, 80);
      const subEnd = { x: anchor.x - subLength, y: anchor.y };

      return {
        id: sub.id,
        start: anchor,
        end: subEnd,
        label: {
          x: (anchor.x + subEnd.x) / 2,
          y: subEnd.y - 8,
        },
      };
    });

    const angle = side === 'top' ? FIXED_TOP_ANGLE : FIXED_BOTTOM_ANGLE;
    layouts.push({
      id: bone.id,
      side,
      angle,
      base,
      end,
      label,
      subBones,
    });
  });

  return layouts;
};

export const calculateFishboneLayout = (
  model: FishboneModel,
  width: number,
  height: number
): FishboneLayout => {
  const safeWidth = Math.max(width, 1000); // Wider for better spacing
  const safeHeight = Math.max(height, 560);
  const centerY = safeHeight / 2;

  const spineStart: Point = { x: safeWidth * 0.1, y: centerY };
  const spineEnd: Point = { x: safeWidth * 0.78, y: centerY }; // Moved slightly left to accommodate drop zone
  const headCenter: Point = { x: safeWidth * 0.88, y: centerY };
  const headRadius = clamp(safeHeight * 0.1, 42, 62);

  const { top, bottom } = distribute(model.bones);
  const topLayouts = createSideLayouts(
    top,
    'top',
    spineStart.x,
    spineEnd.x,
    centerY,
    safeWidth,
    safeHeight
  );
  const bottomLayouts = createSideLayouts(
    bottom,
    'bottom',
    spineStart.x,
    spineEnd.x,
    centerY,
    safeWidth,
    safeHeight
  );

  return {
    width: safeWidth,
    height: safeHeight,
    spineStart,
    spineEnd,
    headCenter,
    headRadius,
    boneLayouts: [...topLayouts, ...bottomLayouts],
  };
};
