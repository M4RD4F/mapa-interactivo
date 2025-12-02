import { useState, useRef, useCallback } from 'react';
import type { Building } from '../components/CampusMap/types.ts';

export const useBuildingSelection = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const selectBuilding = useCallback((building: Building, opener?: HTMLElement | null) => {
    if (opener) lastFocusedRef.current = opener;
    setSelectedBuilding(building);
  }, []);

  const deselectBuilding = useCallback(() => {
    setSelectedBuilding(null);
    lastFocusedRef.current?.focus();
  }, []);

  return {
    selectedBuilding,
    selectBuilding,
    deselectBuilding,
    lastFocusedRef
  };
};
