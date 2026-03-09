"use client";

import { getPurchaseOrdersAction } from "../actions/get-purchaseorders.actions";
import type { PurchaseOrdersQueryParams } from "../types/purchase-orders.types";

export async function purchaseOrdersFetcher(params: PurchaseOrdersQueryParams) {
  const result = await getPurchaseOrdersAction(params);

  if (!result.success) {
    return {
      data: [],
      total: 0,
    };
  }

  return {
    data: result.data,
    total: result.total,
  };
}
