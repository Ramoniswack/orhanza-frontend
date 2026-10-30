"use client";

import { useCallback, useState, type ReactNode } from "react";
import { CustomCursor } from "./CustomCursor";
import { Header } from "./Header";
import { SearchOverlay } from "./SearchOverlay";
import { ShortlistDrawer } from "./ShortlistDrawer";
import { ShortlistProvider } from "./ShortlistProvider";
import { SmoothScroll } from "@/lib/lenis";

export function Shell({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const close = useCallback(() => setSearch(false), []);
  return (
    <SmoothScroll>
      <ShortlistProvider>
        <CustomCursor />
        <Header onSearch={() => setSearch(true)} />
        {children}
        <ShortlistDrawer />
        <SearchOverlay open={search} onClose={close} />
      </ShortlistProvider>
    </SmoothScroll>
  );
}
