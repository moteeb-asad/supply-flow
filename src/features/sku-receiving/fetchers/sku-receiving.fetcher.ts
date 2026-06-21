"use client";

import getSkuReceivingsAction from "../actions/get-sku-receivings.action";
import { SkuReceivingQueryParams } from "../types/query.types";
import { SkuReceivingItem } from "../types/domain.types";

export async function skuReceivingFetcher(params: SkuReceivingQueryParams) {
  // const result = await getSkuReceivingsAction(params);
  const data: SkuReceivingItem[] = [
    {
      id: "1",
      po_number: "PO12345",
      supplier_id: "SUP123",
      status: "pending",
    },
  ];
  if (!data) {
    throw new Error("Failed to fetch SKU receiving data");
  }
  return {
    data,
    total: data.length,
  };
}
