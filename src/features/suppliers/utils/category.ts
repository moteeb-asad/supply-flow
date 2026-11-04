const CATEGORY_LABELS: Record<string, string> = {
  dry: "Dry goods",
  liquid: "Liquid",
  mixed: "Mixed",
};

export const formatCategory = (category: string | null) => {
  if (!category) return "Uncategorized";
  return (
    CATEGORY_LABELS[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  );
};
