"use client";

import { useEffect, useRef } from "react";
import type { LandingVariant } from "@/config/marketing";
import { track } from "@/lib/analytics/events";
import { ProductPreview } from "./ProductPreview";

export function TrackedProductPreview({
  variant,
  compact = false,
}: {
  variant: LandingVariant;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let sent = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sent) {
          sent = true;
          track("example_result_view", { landing_variant: variant });
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [variant]);
  return (
    <div ref={ref}>
      <ProductPreview compact={compact} />
    </div>
  );
}
