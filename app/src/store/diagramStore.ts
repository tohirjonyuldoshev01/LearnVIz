import { create } from 'zustand';
import { Diagram } from '@/types';

interface DiagramStore {
  currentDiagram: Diagram | null;
  diagrams: Diagram[];
  isLoading: boolean;
  setCurrentDiagram: (diagram: Diagram | null) => void;
  setDiagrams: (diagrams: Diagram[]) => void;
  addDiagram: (diagram: Diagram) => void;
  updateDiagram: (diagram: Diagram) => void;
  removeDiagram: (diagramId: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  currentDiagram: null,
  diagrams: [],
  isLoading: false,
  setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),
  setDiagrams: (diagrams) => set({ diagrams }),
  addDiagram: (diagram) =>
    set((state) => ({
      diagrams: [...state.diagrams, diagram],
    })),
  updateDiagram: (diagram) =>
    set((state) => ({
      diagrams: state.diagrams.map((d) =>
        d.id === diagram.id ? diagram : d
      ),
      currentDiagram:
        state.currentDiagram?.id === diagram.id
          ? diagram
          : state.currentDiagram,
    })),
  removeDiagram: (diagramId) =>
    set((state) => ({
      diagrams: state.diagrams.filter((d) => d.id !== diagramId),
      currentDiagram:
        state.currentDiagram?.id === diagramId ? null : state.currentDiagram,
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
