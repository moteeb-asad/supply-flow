"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Starts open when the page is visited with ?<param>=1 (e.g. a dashboard
// "New Order" link opening the create drawer), then removes the param so a
// refresh or Back does not reopen it.
export function useOpenFromQueryParam(param = "create") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = searchParams.get(param) === "1";
  const [isOpen, setIsOpen] = useState(requested);

  useEffect(() => {
    if (!requested) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [requested, param, pathname, router, searchParams]);

  return [isOpen, setIsOpen] as const;
}
