"use client";

import type { ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { Header } from "./Header";
import { ShortlistDrawer } from "./ShortlistDrawer";
import { ShortlistProvider } from "./ShortlistProvider";
import { SmoothScroll } from "@/lib/lenis";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <ShortlistProvider>
        <CustomCursor />
        <Header />
        {children}
        <ShortlistDrawer />
      </ShortlistProvider>
    </SmoothScroll>
  );
}
