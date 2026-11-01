"use client";

import { useCallback, useRef, useState } from "react";
import type { CollectionItem } from "@/data/collection";
import { usePrefersReducedMotion } from "./hooks";
import Showcase from "./Showcase";
import Lineup from "./Lineup";
import styles from "./collection.module.css";

type View = "showcase" | "lineup";

export default function CollectionPage({
  items,
  onReserve,
}: {
  items: CollectionItem[];
  /** Optional: call your own reserve / inquiry handler instead of linking to /collection/[slug]. */
  onReserve?: (slug: string) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState<View>("showcase");
  const [start, setStart] = useState(0);
  const indexRef = useRef(0); // both views report here so the toggle keeps your place
  const onIndexChange = useCallback((i: number) => {
    indexRef.current = i;
  }, []);

  const choose = (v: View) => {
    if (v === view) return;
    setStart(indexRef.current);
    setView(v);
  };

  if (!items.length) return null;

  return (
    <div className={styles.page}>
      <div className={styles.toggleRow} role="group" aria-label="Collection view">
        <button type="button" aria-pressed={view === "showcase"} onClick={() => choose("showcase")}>
          Showcase
        </button>
        <span className={styles.toggleSep} aria-hidden="true">
          /
        </span>
        <button type="button" aria-pressed={view === "lineup"} onClick={() => choose("lineup")}>
          Lineup
        </button>
      </div>

      <div className={styles.viewport}>
        {view === "showcase" ? (
          <div key="showcase" className={styles.view}>
            <Showcase
              items={items}
              startIndex={start}
              onIndexChange={onIndexChange}
              reduced={reduced}
              onReserve={onReserve}
            />
          </div>
        ) : (
          <div key="lineup" className={styles.view}>
            <Lineup
              items={items}
              startIndex={start}
              onIndexChange={onIndexChange}
              reduced={reduced}
              onReserve={onReserve}
            />
          </div>
        )}
      </div>
    </div>
  );
}
