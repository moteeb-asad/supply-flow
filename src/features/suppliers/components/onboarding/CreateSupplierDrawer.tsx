import { SupplierDrawer } from "./SupplierDrawer";
import { SupplierForm, SUPPLIER_FORM_ID } from "./SupplierForm";

type CreateSupplierDrawerProps = {
  onClose?: () => void;
};

export function CreateSupplierDrawer({ onClose }: CreateSupplierDrawerProps) {
  return (
    <SupplierDrawer
      title="Add New Supplier"
      description="Fill in the details to onboard a new vendor."
      submitLabel="Save & Onboard Supplier"
      formId={SUPPLIER_FORM_ID}
      onClose={onClose}
    >
      <SupplierForm formId={SUPPLIER_FORM_ID} />
    </SupplierDrawer>
  );
}
