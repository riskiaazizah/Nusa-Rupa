"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";

export const GalleryContext = React.createContext(null);

const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
};

/**
 * Root Gallery Provider
 * Manages the state of the expanded image and renders the Modal.
 */
export function Gallery({ children }) {
  const [selectedImage, setSelectedImage] = React.useState(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  );
}

/**
 * Responsive Masonry Grid
 */
export function GalleryGrid({ children, className }) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Individual Gallery Image Thumbnail
 */
export function GalleryImage({
  src,
  alt,
  id,
  className,
  data,
  children,
}) {
  const context = React.useContext(GalleryContext);
  if (!context) throw new Error("GalleryImage must be used within a Gallery");

  const imageData = { id, src, alt, ...data };

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "relative mb-4 break-inside-avoid cursor-zoom-in rounded-2xl overflow-hidden",
        className
      )}
      onClick={() => context.setSelectedImage(imageData)}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || "Gallery Image"}
        className="w-full h-auto object-cover rounded-2xl"
        variants={{
          hover: { scale: 0.985 },
          tap: { scale: 0.96 },
        }}
        transition={spring}
      />

      {children}
    </motion.div>
  );
}

/**
 * Expanded View Modal with Drag-to-Dismiss
 */
export function GalleryModal() {
  const context = React.useContext(GalleryContext);
  if (!context) return null;

  const { selectedImage, setSelectedImage } = context;

  const PILLAR_COLORS = {
    forest: "#1f6b45",
    animals: "#2f3fa8",
    people: "#d92e1c",
  };

  const pillarColor =
    (selectedImage && PILLAR_COLORS[selectedImage.pillar]) || "#1f6b45";

  return (
    <AnimatePresence>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          {/* Frosted glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          />

          {/* Interactive container for drag gesture */}
          <motion.div
            className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-zoom-out select-none"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => {
              if (
                Math.abs(info.offset.y) > 100 ||
                Math.abs(info.velocity.y) > 300
              ) {
                setSelectedImage(null);
              }
            }}
            onClick={() => setSelectedImage(null)}
          >
            {/* The Shared Element */}
            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.src}
              alt={selectedImage.alt || selectedImage.title || "Selected gallery image"}
              className="w-auto h-auto max-w-[92vw] max-h-[76vh] sm:max-h-[80vh] rounded-2xl shadow-2xl object-contain will-change-transform"
              draggable={false}
              transition={spring}
            />

            {/* Editorial TIGA Artwork Info Overlay Card */}
            {(selectedImage.title || selectedImage.artist) && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="mt-4 flex flex-wrap items-center justify-between gap-4 max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 text-white pointer-events-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    {selectedImage.pillar && (
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: pillarColor }}
                      />
                    )}
                    {selectedImage.category && (
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                        {selectedImage.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold truncate text-white">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-white/80 truncate">
                    by <span className="font-medium text-white">{selectedImage.artist || "Unknown"}</span>
                    {typeof selectedImage.likes === "number" && (
                      <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-white/70">
                        <Heart className="h-3 w-3 fill-current text-white/60" /> {selectedImage.likes}
                      </span>
                    )}
                  </p>
                </div>

                {selectedImage.href && (
                  <Link
                    href={selectedImage.href}
                    className="shrink-0 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-cream transition shadow-xs"
                  >
                    <span>View Story</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => setSelectedImage(null)}
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
