import { useCallback, useState } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { diagramService } from '@/services/diagramService';
import { Diagram } from '@/types';

export const useDiagrams = (userId: string) => {
  const diagrams = useDiagramStore((state) => state.diagrams);
  const currentDiagram = useDiagramStore((state) => state.currentDiagram);
  const isLoading = useDiagramStore((state) => state.isLoading);
  const setDiagrams = useDiagramStore((state) => state.setDiagrams);
  const addDiagram = useDiagramStore((state) => state.addDiagram);
  const updateDiagramInStore = useDiagramStore((state) => state.updateDiagram);
  const removeDiagram = useDiagramStore((state) => state.removeDiagram);
  const setCurrentDiagram = useDiagramStore((state) => state.setCurrentDiagram);
  const setIsLoading = useDiagramStore((state) => state.setIsLoading);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDiagrams = useCallback(async () => {
    if (!userId) {
      setDiagrams([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const diagrams = await diagramService.getUserDiagrams(userId);
      setDiagrams(diagrams);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setDiagrams, setIsLoading, userId]);

  const createDiagram = useCallback(async (diagram: Diagram) => {
    try {
      await diagramService.createDiagram(diagram);
      addDiagram(diagram);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [addDiagram]);

  const updateDiagram = useCallback(async (diagram: Diagram) => {
    try {
      await diagramService.updateDiagram(diagram.id, diagram);
      updateDiagramInStore(diagram);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [updateDiagramInStore]);

  const deleteDiagram = useCallback(async (diagramId: string) => {
    // Note: Firestore security rules already enforce that only the creator can
    // delete a document. an additional client-side check used to live here but
    // caused problems when the hook was instantiated before the user's id was
    // known (e.g. navigating directly to a diagram page). in that scenario we
    // would bail out with "You are not allowed to delete this diagram" even
    // though the backend would happily remove it once auth state stabilized.
    //
    // To avoid confusing behaviour we simply perform an optimistic removal and
    // let the service call (and ultimately Firestore) determine success.
    const existing = diagrams.find((d) => d.id === diagramId);

    // remove from local store immediately so the UI feels snappy. callers may
    // also refresh from the server after the promise resolves. if the network
    // call fails we need to put the diagram back so the UI doesn't lie.
    removeDiagram(diagramId);
    try {
      await diagramService.deleteDiagram(diagramId);
      setError(null);
    } catch (err: any) {
      // rollback the optimistic removal
      if (existing) {
        addDiagram(existing);
      }
      setError(err.message);
      throw err;
    }
  }, [addDiagram, diagrams, removeDiagram]);

  return {
    diagrams,
    currentDiagram,
    isLoading,
    error,
    fetchUserDiagrams,
    createDiagram,
    updateDiagram,
    deleteDiagram,
    setCurrentDiagram,
  };
};
