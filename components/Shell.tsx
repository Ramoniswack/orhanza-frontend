"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { SearchOverlay } from "./SearchOverlay";
import { ShortlistDrawer } from "./ShortlistDrawer";
import { ShortlistProvider } from "./ShortlistProvider";
import { SmoothScroll } from "./SmoothScroll";

export function Shell({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState(false);
  const close = useCallback(() => setSearch(false), []);
  return (
    <SmoothScroll>
      <ShortlistProvider>
        <Header onSearch={() => setSearch(true)} />
        {children}
        <ShortlistDrawer />
        <SearchOverlay open={search} onClose={close} />
      </ShortlistProvider>
    </SmoothScroll>
  );
}
