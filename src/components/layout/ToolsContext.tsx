'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface ToolsContextValue {
  tools: ReactNode;
  setTools: (tools: ReactNode) => void;
}

const ToolsContext = createContext<ToolsContextValue | undefined>(undefined);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setToolsState] = useState<ReactNode>(
    <section className="tool-section">
      <h2>Tools</h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
        No tools defined for this page
      </p>
    </section>
  );

  const setTools = useCallback((newTools: ReactNode) => {
    setToolsState(newTools);
  }, []);

  return (
    <ToolsContext.Provider value={{ tools, setTools }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useToolsContext() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useToolsContext must be used within a ToolsProvider');
  }
  return context;
}

export function useTools(toolsContent: ReactNode) {
  const { setTools } = useToolsContext();
  
  useEffect(() => {
    setTools(toolsContent);
    
    // No cleanup needed - let the next page set its own tools
  }, [toolsContent, setTools]);
}