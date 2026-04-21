export type SupplierAssignmentSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
  error?: string;
};

export type InventoryItemFormValues = {
  itemName: string;
  skuCode: string;
  category: string;
  initialStock: number;
  unitPrice: number;
  primarySupplier: string;
};

export type InventoryItemFormProps = {
  formId?: string;
  initialValues?: Partial<InventoryItemFormValues>;
  onSubmit?: (values: InventoryItemFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export type GeneralInformationSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
  itemNameError?: string;
  skuCodeError?: string;
  categoryError?: string;
};

export type StockDetailsSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
  initialStockError?: string;
  unitPriceError?: string;
};
