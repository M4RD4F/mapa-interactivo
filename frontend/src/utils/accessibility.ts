export const handleKeyboardNavigation = (
  e: React.KeyboardEvent,
  onSelect: () => void,
  onClose?: () => void
) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      onSelect();
      break;
    case 'Escape':
      if (onClose) {
        e.preventDefault();
        onClose();
      }
      break;
    case 'Tab':
      // Permitir tabulación normal
      break;
  }
};

export const getAriaLabelForBuilding = (
  building: any,
  showEvents: boolean
): string => {
  const baseLabel = `${building.name}. ${building.description}`;
  const eventLabel = building.hasUpcomingEvent && showEvents 
    ? ' Tiene eventos próximos.' 
    : '';
  const occupancyLabel = building.occupancy 
    ? ` Ocupación actual: ${building.occupancy}%.` 
    : '';
  
  return baseLabel + eventLabel + occupancyLabel;
};

export const focusTrap = (
  element: HTMLElement | null,
  e: KeyboardEvent
) => {
  if (!element || e.key !== 'Tab') return;

  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
};