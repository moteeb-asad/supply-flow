"use client";

import { useMemo, useState } from "react";

import GeneralInformationSection from "./GeneralInformationSection";
import StockDetailsSection from "./StockDetailsSection";
import SupplierAssignmentSection from "./SupplierAssignmentSection";

export const INVENTORY_ITEM_FORM_ID = "inventory-item-form";

export type InventoryItemFormValues = {
  itemName: string;
  skuCode: string;
  category: string;
  initialStock: number;
  unitPrice: number;
  primarySupplier: string;
};

type InventoryItemFormProps = {
  formId?: string;
  initialValues?: Partial<InventoryItemFormValues>;
  onSubmit?: (values: InventoryItemFormValues) => void;
};

const defaultValues: InventoryItemFormValues = {
  itemName: "",
  skuCode: "",
  category: "",
  initialStock: 0,
  unitPrice: 0,
  primarySupplier: "",
};

export default function InventoryItemForm({
  formId = INVENTORY_ITEM_FORM_ID,
  initialValues,
  onSubmit,
}: InventoryItemFormProps) {
  const [values, setValues] = useState<InventoryItemFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const estimatedValue = useMemo(
    () => Number((values.initialStock * values.unitPrice).toFixed(2)),
    [values.initialStock, values.unitPrice],
  );

  const updateField = <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form
      className="flex-1 overflow-y-auto p-8 space-y-8"
      id={formId}
      noValidate
      onSubmit={handleSubmit}
    >
      <GeneralInformationSection values={values} onChange={updateField} />
      <StockDetailsSection
        values={values}
        estimatedValue={estimatedValue}
        onChange={updateField}
      />
      <SupplierAssignmentSection values={values} onChange={updateField} />
    </form>
  );
}
