// src/hooks/useMapNavigation.ts
import { useState, useCallback } from 'react';
import type { Viewport } from '../components/CampusMap/types';
import { MIN_ZOOM, MAX_ZOOM } from '../components/CampusMap/constants';

export function useMapNavigation(initialViewport: Viewport) {
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number }>({
    x: initialViewport.x,
    y: initialViewport.y,
  });

  const handleZoom = useCallback((delta: number) => {
    setViewport(prev => {
      let newScale = prev.scale + delta;
      newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
      return { ...prev, scale: newScale };
    });
  }, []);

  const resetViewport = useCallback(() => {
    setViewport(initialViewport);
  }, [initialViewport]);

  // 👇 AHORA usamos React.MouseEvent
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastPosition({ x: viewport.x, y: viewport.y });
    },
    [viewport]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setViewport(prev => ({
        ...prev,
        x: lastPosition.x + dx,
        y: lastPosition.y + dy,
      }));
    },
    [isDragging, dragStart, lastPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // 👇 Igual para touch en React
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setLastPosition({ x: viewport.x, y: viewport.y });
    },
    [viewport]
  );

  return {
    viewport,
    setViewport,
    isDragging,
    handleZoom,
    resetViewport,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleMouseUp,
  };
}
