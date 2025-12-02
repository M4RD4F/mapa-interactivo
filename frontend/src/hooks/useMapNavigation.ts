import { useCallback, useState, useEffect } from 'react';
import type { Viewport } from '../components/CampusMap/types';

export const useMapNavigation = (initialViewport: Viewport) => {
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoom = useCallback((delta: number) => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta))
    }));
  }, []);

  const resetViewport = useCallback(() => {
    setViewport(initialViewport);
  }, [initialViewport]);

  const zoomToPoint = useCallback((x: number, y: number, scale: number) => {
    setViewport({ x, y, scale });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - viewport.x, 
      y: e.clientY - viewport.y 
    });
  }, [viewport]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - viewport.x,
        y: e.touches[0].clientY - viewport.y
      });
    }
  }, [viewport]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setViewport({
      ...viewport,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, viewport, dragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setViewport({
      ...viewport,
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  }, [isDragging, viewport, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    viewport,
    setViewport,
    isDragging,
    handleZoom,
    resetViewport,
    zoomToPoint,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleMouseUp
  };
};