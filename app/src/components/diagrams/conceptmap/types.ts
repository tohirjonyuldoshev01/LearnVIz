export interface ConceptNode {
  id: string;
  text: string;
  x: number;
  y: number;
  colorIndex: number;
}

export interface ConceptConnection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

export interface ConceptMapModel {
  nodes: ConceptNode[];
  connections: ConceptConnection[];
}
