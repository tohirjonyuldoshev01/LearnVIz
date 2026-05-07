import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Diagram } from '@/types';

export const diagramService = {
  // Create new diagram
  createDiagram: async (diagram: Diagram): Promise<void> => {
    try {
      await setDoc(doc(db, 'diagrams', diagram.id), diagram);
    } catch (error: any) {
      throw new Error(`Failed to create diagram: ${error.message}`);
    }
  },

  // Get diagram by ID – with optional userId ownership check
  getDiagram: async (diagramId: string, userId?: string): Promise<Diagram | null> => {
    try {
      const docSnapshot = await getDoc(doc(db, 'diagrams', diagramId));
      if (!docSnapshot.exists()) return null;
      const data = docSnapshot.data() as Diagram;
      // If a userId was provided, verify ownership
      if (userId && data.createdBy !== userId) return null;
      return data;
    } catch (error: any) {
      throw new Error(`Failed to get diagram: ${error.message}`);
    }
  },

  // Get all diagrams for a user
  getUserDiagrams: async (userId: string): Promise<Diagram[]> => {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'diagrams'),
        where('createdBy', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Diagram);
    } catch (error: any) {
      throw new Error(`Failed to get user diagrams: ${error.message}`);
    }
  },

  // Update diagram – verifies ownership before writing
  updateDiagram: async (
    diagramId: string,
    updates: Partial<Diagram>,
    userId?: string
  ): Promise<void> => {
    try {
      if (userId) {
        const existing = await getDoc(doc(db, 'diagrams', diagramId));
        if (!existing.exists() || (existing.data() as Diagram).createdBy !== userId) {
          throw new Error('Not authorized to update this diagram');
        }
      }
      await updateDoc(doc(db, 'diagrams', diagramId), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update diagram: ${error.message}`);
    }
  },

  // Delete diagram – verifies ownership before deleting
  deleteDiagram: async (diagramId: string, userId?: string): Promise<void> => {
    try {
      if (userId) {
        const existing = await getDoc(doc(db, 'diagrams', diagramId));
        if (!existing.exists() || (existing.data() as Diagram).createdBy !== userId) {
          throw new Error('Not authorized to delete this diagram');
        }
      }
      await deleteDoc(doc(db, 'diagrams', diagramId));
    } catch (error: any) {
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
  },

  // Get public diagrams
  getPublicDiagrams: async (limit: number = 10): Promise<Diagram[]> => {
    try {
      const q = query(
        collection(db, 'diagrams'),
        where('isPublic', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => doc.data() as Diagram)
        .slice(0, limit);
    } catch (error: any) {
      throw new Error(`Failed to get public diagrams: ${error.message}`);
    }
  },

  // Search diagrams by topic
  searchDiagrams: async (userId: string, topic: string): Promise<Diagram[]> => {
    try {
      const q = query(
        collection(db, 'diagrams'),
        where('createdBy', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => doc.data() as Diagram)
        .filter((diagram) =>
          diagram.topic.toLowerCase().includes(topic.toLowerCase())
        );
    } catch (error: any) {
      throw new Error(`Failed to search diagrams: ${error.message}`);
    }
  },
};
