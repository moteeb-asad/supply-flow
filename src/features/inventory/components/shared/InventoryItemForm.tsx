"use client";

import { useState } from "react";
import GeneralInformationSection from "./GeneralInformationSection";
import StockDetailsSection from "./StockDetailsSection";
import SupplierAssignmentSection from "./SupplierAssignmentSection";
import { AddInventoryItemSchema } from "../../validators/inventory-item.schema";
import type {
  InventoryItemFormProps,
  InventoryItemFormValues,
} from "../../types/form.types";

const defaultValues: InventoryItemFormValues = {
  itemName: "",
  skuCode: "",
  category: "",
  initialStock: 0,
  unitPrice: 0,
  primarySupplier: "",
};

export default function InventoryItemForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: InventoryItemFormProps) {
  const [values, setValues] = useState<InventoryItemFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    itemName?: string;
    skuCode?: string;
    category?: string;
    initialStock?: string;
    unitPrice?: string;
    primarySupplier?: string;
  }>({});

  const updateField = (
    field: keyof InventoryItemFormValues,
    value: InventoryItemFormValues[keyof InventoryItemFormValues],
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const ItemName = String(formData.get("itemName") ?? "").trim();
    const skuCode = String(formData.get("skuCode") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const initialStock = Number(formData.get("initialStock") ?? 0);
    const unitPrice = Number(formData.get("unitPrice") ?? 0);
    const primarySupplier = String(
      formData.get("primarySupplier") ?? "",
    ).trim();

    const ValidationResult = AddInventoryItemSchema.safeParse({
      itemName: ItemName,
      skuCode: skuCode,
      category: category,
      initialStock: initialStock,
      unitPrice: unitPrice,
      primarySupplier: primarySupplier,
    });

    const payload: InventoryItemFormValues = {
      itemName: ItemName,
      skuCode: skuCode,
      category: category,
      initialStock: initialStock,
      unitPrice: unitPrice,
      primarySupplier: primarySupplier,
    };

    if (!ValidationResult.success) {
      console.error("Validation failed:", ValidationResult.error);

      const flattenedFieldErrors = ValidationResult.error.flatten().fieldErrors;
      setFieldErrors({
        itemName: flattenedFieldErrors.itemName?.[0],
        skuCode: flattenedFieldErrors.skuCode?.[0],
        category: flattenedFieldErrors.category?.[0],
        initialStock: flattenedFieldErrors.initialStock?.[0],
        unitPrice: flattenedFieldErrors.unitPrice?.[0],
        primarySupplier: flattenedFieldErrors.primarySupplier?.[0],
      });

      const summaryErrors = Object.values(flattenedFieldErrors)
        .flat()
        .filter((message): message is string => Boolean(message));
      const dedupedSummaryErrors = [...new Set(summaryErrors)];
      setValidationErrors(
        dedupedSummaryErrors.length > 0
          ? dedupedSummaryErrors
          : ["Please fix the highlighted form issues."],
      );
      return;
    }

    setFieldErrors({});
    setValidationErrors([]);
    onSubmit?.(payload);
  };

  return (
    <form
      className="flex-1 overflow-y-auto p-6 space-y-8"
      noValidate
      onSubmit={handleSubmit}
    >
      <div
        className={`flex-1 min-h-0 space-y-8 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        {validationErrors.length > 0 ? (
          <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            {validationErrors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}

        <SupplierAssignmentSection
          values={values}
          onChange={updateField}
          error={fieldErrors.primarySupplier}
        />
        <GeneralInformationSection
          values={values}
          onChange={updateField}
          itemNameError={fieldErrors.itemName}
          skuCodeError={fieldErrors.skuCode}
          categoryError={fieldErrors.category}
        />
        <StockDetailsSection
          values={values}
          onChange={updateField}
          initialStockError={fieldErrors.initialStock}
          unitPriceError={fieldErrors.unitPrice}
        />
      </div>
    </form>
  );
}
