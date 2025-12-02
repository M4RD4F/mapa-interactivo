// Define el tipo localmente para evitar problemas de import
type Building = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  description: string;
  hasUpcomingEvent?: boolean;
  events?: { title: string; time: string; location: string }[];
  occupancy?: number;
  facilities?: string[];
  category?: string;
};

export const calculateTouchTarget = (
  building: Building,
  minSize: number = 44
): { x: number; y: number; width: number; height: number } => {
  const hitWidth = Math.max(building.width, minSize);
  const hitHeight = Math.max(building.height, minSize);
  const hitX = building.x - Math.max(0, (hitWidth - building.width) / 2);
  const hitY = building.y - Math.max(0, (hitHeight - building.height) / 2);

  return { x: hitX, y: hitY, width: hitWidth, height: hitHeight };
};

export const getFontSizeForBuilding = (
  building: Building,
  minSize: number = 10,
  maxSize: number = 14
): number => {
  const baseSize = building.width / 12;
  return Math.max(minSize, Math.min(maxSize, baseSize));
};

export const getFilteredBuildings = (
  buildings: Building[],
  searchTerm: string,
  category: string
): Building[] => {
  return buildings.filter(building => {
    const matchesSearch = 
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      category === "all" || building.category === category;

    return matchesSearch && matchesCategory;
  });
};

export const getBuildingStatistics = (buildings: Building[]) => {
  const totalBuildings = buildings.length;
  const buildingsWithEvents = buildings.filter(b => b.hasUpcomingEvent).length;
  const averageOccupancy = Math.round(
    buildings.reduce((acc, b) => acc + (b.occupancy || 0), 0) / buildings.length
  );

  return { totalBuildings, buildingsWithEvents, averageOccupancy };
};