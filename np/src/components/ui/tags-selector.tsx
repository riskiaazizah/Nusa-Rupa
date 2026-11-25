"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export type Tag = {
  id: string;
  label: string;
  color?: string;
};

export type TagsSelectorProps = {
  tags: Tag[];
  selectedTags?: Tag[];
  onChange?: (tags: Tag[]) => void;
  title?: string;
  className?: string;
};

export function TagsSelector({
  tags,
  selectedTags: controlledSelected,
  onChange,
  title = "TAGS",
  className = "",
}: TagsSelectorProps) {
  const [internalSelected, setInternalSelected] = useState<Tag[]>([]);
  const selectedTags = controlledSelected ?? internalSelected;
  const selectedsContainerRef = useRef<HTMLDivElement>(null);

  const updateSelected = (next: Tag[]) => {
    if (controlledSelected === undefined) {
      setInternalSelected(next);
    }
    onChange?.(next);
  };

  const removeSelectedTag = (id: string) => {
    updateSelected(selectedTags.filter((tag) => tag.id !== id));
  };

  const addSelectedTag = (tag: Tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) return;
    updateSelected([...selectedTags, tag]);
  };

  useEffect(() => {
    if (selectedsContainerRef.current) {
      selectedsContainerRef.current.scrollTo({
        left: selectedsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedTags]);

  return (
    <div className={`p-6 max-w-lg w-full flex flex-col ${className}`}>
      <motion.h2 layout className="text-xl font-semibold">
        {title}
      </motion.h2>
      <motion.div
        className="w-full flex items-center justify-start gap-1.5 bg-white border h-14 mt-2 mb-3 overflow-x-auto p-1.5 no-scrollbar"
        style={{
          borderRadius: 16,
        }}
        ref={selectedsContainerRef}
        layout
      >
        {selectedTags.length === 0 ? (
          <span className="text-xs text-gray-400 pl-3">Pilih tag di bawah...</span>
        ) : (
          selectedTags.map((tag) => (
            <motion.div
              key={tag.id}
              className="flex items-center gap-1 pl-3 pr-1 py-1 bg-white shadow-md border h-full shrink-0"
              style={{
                borderRadius: 14,
              }}
              layoutId={`tag-${tag.id}`}
            >
              {tag.color && (
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
              )}
              <motion.span
                layoutId={`tag-${tag.id}-label`}
                className="text-gray-700 font-medium text-sm"
              >
                {tag.label}
              </motion.span>
              <button
                type="button"
                onClick={() => removeSelectedTag(tag.id)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={`Hapus ${tag.label}`}
              >
                <X className="size-4 text-gray-500" />
              </button>
            </motion.div>
          ))
        )}
      </motion.div>
      {tags.length > selectedTags.length && (
        <motion.div
          className="bg-white shadow-sm p-2 border w-full"
          style={{
            borderRadius: 16,
          }}
          layout
        >
          <motion.div className="flex flex-wrap gap-2">
            {tags
              .filter(
                (tag) =>
                  !selectedTags.some((selected) => selected.id === tag.id)
              )
              .map((tag) => (
                <motion.button
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100/60 hover:bg-gray-200/70 transition-colors rounded-full shrink-0 cursor-pointer"
                  onClick={() => addSelectedTag(tag)}
                  style={{
                    borderRadius: 14,
                  }}
                >
                  {tag.color && (
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}
                  <motion.span
                    layoutId={`tag-${tag.id}-label`}
                    className="text-gray-700 font-medium text-xs tracking-wide"
                  >
                    {tag.label}
                  </motion.span>
                </motion.button>
              ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default TagsSelector;
