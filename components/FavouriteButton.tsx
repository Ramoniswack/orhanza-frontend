"use client";

import { motion } from "motion/react";
import { useShortlist } from "./ShortlistProvider";

/** Heart toggle — saves a piece to Favourites (kept in the browser, separate from the consultation shortlist). */
export function FavouriteButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { isFav, toggleFav } = useShortlist();
  const fav = isFav(slug);
  return (
    <motion.button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(slug); }}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      whileTap={{ scale: 0.82 }}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-charcoal backdrop-blur transition-colors hover:bg-white ${className}`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        key={String(fav)}
        initial={{ scale: fav ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 14 }}
        fill={fav ? "#5B1F27" : "none"}
        stroke={fav ? "#5B1F27" : "currentColor"}
        strokeWidth={1.7}
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.4 4.8 6.6 4.8c2 0 3.6 1.1 5.4 3.2 1.8-2.1 3.4-3.2 5.4-3.2 3.2 0 5.1 3.2 3.9 6.5-1.8 4.6-9.3 9.2-9.3 9.2z" />
      </motion.svg>
    </motion.button>
  );
}
