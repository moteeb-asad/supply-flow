"use client";

import getSkuReceivingsAction from "../actions/get-sku-receivings.action";
import { SkuReceivingQueryParams } from "../types/query.types";

export async function skuReceivingFetcher(params: SkuReceivingQueryParams) {
  // const result = await getSkuReceivingsAction(params);
  const result = {
    success: true,
    total: 1,
    data: [
      {
        id: "1",
        po_number: "PO12345",
        supplier_id: "SUP123",
      },
    ],
  };
  if (!result.success) {
    throw new Error("Failed to fetch SKU receiving data");
  }
  return {
    data: result.data,
    total: result.total,
  };
}
