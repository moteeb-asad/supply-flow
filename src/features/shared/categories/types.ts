// Shared types for CategoryPicker and category actions

export type SharedCategoryOption = {
  id: string;
  name: string;
  description: string | null;
};

export type GetCategoriesInput = {
  search?: string;
  limit?: number;
  offset?: number;
};

export type GetCategoriesResult = {
  items: SharedCategoryOption[];
  nextOffset: number | null;
};

export type CategoryPickerProps = {
  initialCategoryId?: string;
  initialCategoryName?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  categoryIdFieldName?: string;
  categoryNameFieldName?: string;
  onCategoryChange?: (category: SharedCategoryOption | null) => void;
};
