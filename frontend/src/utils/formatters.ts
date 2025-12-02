export const formatBuildingName = (name: string): string => {
    const words = name.split(' ');
    if (words.length > 2) {
      return words.map((word, i, arr) => 
        i === 1 ? `${word}\n` : word
      ).join(' ');
    }
    return name;
  };
  
  export const formatOccupancyColor = (percentage: number): string => {
    if (percentage > 80) return '#ef4444'; // red-500
    if (percentage > 60) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };
  
  export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    if (isNaN(hour)) return time;
    
    return hour >= 12 
      ? `${hour > 12 ? hour - 12 : hour}:${minutes} PM`
      : `${hour}:${minutes} AM`;
  };