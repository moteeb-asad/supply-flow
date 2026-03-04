export const formatCategory = (category: string | null) => {
  if (!category) {
    return "Uncategorized";
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const getCategoryIcon = (category: string | null) => {
  switch (category) {
    case "dry":
      return "inventory";
    case "liquid":
      return "water_drop";
    case "mixed":
      return "layers";
    default:
      return "inventory_2";
  }
};
