export type BoneSide = 'top' | 'bottom';

export interface FishboneSubCause {
  id: string;
  text: string;
}

export interface FishboneBone {
  id: string;
  label: string;
  side: BoneSide;
  angle: number;
  manualDx?: number;
  manualDy?: number;
  subCauses: FishboneSubCause[];
}

export interface FishboneModel {
  effect: string;
  bones: FishboneBone[];
}

export interface Point {
  x: number;
  y: number;
}

export interface FishboneSubBoneLayout {
  id: string;
  start: Point;
  end: Point;
  label: Point;
}

export interface FishboneBoneLayout {
  id: string;
  side: BoneSide;
  angle: number;
  base: Point;
  end: Point;
  label: Point;
  subBones: FishboneSubBoneLayout[];
}

export interface FishboneLayout {
  width: number;
  height: number;
  spineStart: Point;
  spineEnd: Point;
  headCenter: Point;
  headRadius: number;
  boneLayouts: FishboneBoneLayout[];
}
