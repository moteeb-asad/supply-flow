"use client";

import { getSkuReceivingsAction } from "../actions/get-sku-receivings.action";
import type { SkuReceivingQueryParams } from "../types";

export async function skuReceivingFetcher(params: SkuReceivingQueryParams) {
  const result = await getSkuReceivingsAction(params);

  if (!result.success) {
    throw new Error("Failed to fetch SKU receiving data");
  }

  return {
    data: result.data,
    total: result.total,
  };
}
