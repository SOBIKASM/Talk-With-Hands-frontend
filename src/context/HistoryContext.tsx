import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure for a confirmed sentence entry
export interface SentenceEntry {
  id: string;
  type: 'sentence';
  content: string;
  accuracy: number; 
  timestamp: Date;
  session: string; 
}

interface HistoryContextType {
  history: SentenceEntry[];
  addEntry: (content: string) => Promise<boolean>;
  // We don't expose resetHistory globally since the Recognition component handles it internally.
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const getCurrentSessionId = () => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  // Using a short timestamp for session uniqueness on a given day
  return `S-${date}-${Date.now().toString().slice(-4)}`; 
};


export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<SentenceEntry[]>([]);

  const addEntry = async (content: string): Promise<boolean> => {
    if (!content.trim()) return false;

    const newEntry: SentenceEntry = {
      id: Date.now().toString(),
      type: 'sentence',
      content: content.trim(),
      accuracy: Math.round(80 + Math.random() * 15), // Mock or estimated accuracy
      timestamp: new Date(),
      session: getCurrentSessionId(),
    };

    try {
      // 🎯 API Call to FastAPI (Step 4)
      const response = await fetch('http://localhost:8000/api/save-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          timestamp: newEntry.timestamp.toISOString(), // Convert Date to ISO string for transmission
        }),
      });

      if (!response.ok) {
        console.error('Failed to save sentence to MongoDB:', await response.text());
        return false;
      }
      
      // Update local state ONLY on successful API save
      setHistory(prev => [newEntry, ...prev]); 
      return true;

    } catch (error) {
      console.error('Error connecting to backend API. Is FastAPI running?', error);
      return false;
    }
  };


  return (
    <HistoryContext.Provider value={{ history, addEntry }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};