"use client";

import { getPurchaseOrdersAction } from "../actions/get-purchaseorders.actions";
import type { PurchaseOrdersQueryParams } from "../types";

export async function purchaseOrdersFetcher(params: PurchaseOrdersQueryParams) {
  const result = await getPurchaseOrdersAction(params);
  if (!result.success) {
    throw new Error("Failed to fetch purchase orders");
  }

  return {
    data: result.data,
    total: result.total,
  };
}
