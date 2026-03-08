export const formatStatus = (status: string | null) => {
  if (!status) {
    return "Active";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};
