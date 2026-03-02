import { SupplierDrawer } from "./SupplierDrawer";
import {
  SupplierForm,
  SUPPLIER_FORM_ID,
  type SupplierFormValues,
} from "./SupplierForm";

type EditSupplierDrawerProps = {
  onClose?: () => void;
  initialValues?: Partial<SupplierFormValues>;
};

export function EditSupplierDrawer({
  onClose,
  initialValues,
}: EditSupplierDrawerProps) {
  return (
    <SupplierDrawer
      title="Edit Supplier"
      description="Update supplier details and save changes."
      submitLabel="Save Changes"
      formId={SUPPLIER_FORM_ID}
      onClose={onClose}
    >
      <SupplierForm formId={SUPPLIER_FORM_ID} initialValues={initialValues} />
    </SupplierDrawer>
  );
}
