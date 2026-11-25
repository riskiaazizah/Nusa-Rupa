"use client";

import { useId, useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const BASE =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm sm:text-base text-ink outline-none transition placeholder:text-mute/50 focus:border-forest focus:ring-1 focus:ring-forest";

const THEME_ISSUE_TAGS = [
  // Forest Pillar (Green #1f6b45)
  { id: "peatland", label: "Peatland", color: "#1f6b45" },
  { id: "forest fire", label: "Forest Fire", color: "#1f6b45" },
  { id: "palm oil expansion", label: "Palm Oil Expansion", color: "#1f6b45" },
  { id: "reforestation", label: "Reforestation", color: "#1f6b45" },
  { id: "deforestation", label: "Deforestation", color: "#1f6b45" },

  // Animals Pillar (Blue #2f3fa8)
  { id: "habitat loss", label: "Habitat Loss", color: "#2f3fa8" },
  { id: "endangered species", label: "Endangered Species", color: "#2f3fa8" },
  { id: "orangutan", label: "Orangutan", color: "#2f3fa8" },
  { id: "wildlife conservation", label: "Wildlife Conservation", color: "#2f3fa8" },

  // People Pillar (Red #d92e1c)
  { id: "indigenous rights", label: "Indigenous Rights", color: "#d92e1c" },
  { id: "smoke haze", label: "Smoke & Haze", color: "#d92e1c" },
  { id: "climate change", label: "Climate Change", color: "#d92e1c" },
  { id: "sustainable living", label: "Sustainable Living", color: "#d92e1c" },
];

function Field({ id, label, error, hint, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold tracking-wide text-ink/80">
        {label}
        {required && <span className="ml-1 text-people">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs sm:text-sm text-mute">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs sm:text-sm font-medium text-people">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ArtworkFields({ values, errors, onChange, categories }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const props = (name) => ({
    id: id(name),
    name,
    value: values[name],
    onChange,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
    className: `${BASE} ${errors[name] ? "border-people ring-1 ring-people/30" : "border-line hover:border-ink/40"}`,
  });

  const [customTag, setCustomTag] = useState("");
  const selectedsContainerRef = useRef(null);

  const selectedTagList = useMemo(() => {
    const raw = String(values.tags || "");
    const set = new Set();
    for (const part of raw.split(",")) {
      const clean = part.trim().toLowerCase().replace(/\s+/g, " ");
      if (clean) set.add(clean);
    }
    return Array.from(set).map((tagId) => {
      const found = THEME_ISSUE_TAGS.find((t) => t.id === tagId);
      return (
        found || {
          id: tagId,
          label: tagId,
          color: "#0f0f0f",
        }
      );
    });
  }, [values.tags]);

  const addTag = (tagId) => {
    const current = selectedTagList.map((t) => t.id);
    if (current.includes(tagId)) return;
    if (current.length >= 10) return;
    const next = [...current, tagId].join(", ");
    onChange({ target: { name: "tags", value: next } });
  };

  const removeTag = (tagId) => {
    const current = selectedTagList.map((t) => t.id);
    const next = current.filter((tag) => tag !== tagId).join(", ");
    onChange({ target: { name: "tags", value: next } });
  };

  const handleCustomSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const trimmed = customTag.trim().toLowerCase().replace(/\s+/g, " ");
      if (trimmed) {
        addTag(trimmed);
        setCustomTag("");
      }
    }
  };

  useEffect(() => {
    if (selectedsContainerRef.current) {
      selectedsContainerRef.current.scrollTo({
        left: selectedsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedTagList]);

  return (
    <div className="space-y-5">
      <Field id={id("title")} label="Artwork Title" error={errors.title} required>
        <input type="text" placeholder="e.g. Whispers of the Peat Forest" {...props("title")} />
      </Field>

      <Field id={id("description")} label="Description" error={errors.description} required>
        <textarea
          rows={4}
          placeholder="Tell the story behind this artwork, materials, or ecological context..."
          {...props("description")}
        />
      </Field>

      <Field id={id("categoryId")} label="Category" error={errors.categoryId} required>
        <select {...props("categoryId")}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={id("tags")}
        label="Issue Tags"
        error={errors.tags}
        hint="Select issue tags that represent the environmental or community impact of this artwork (1 to 10 tags)."
        required
      >
        <input type="hidden" name="tags" value={values.tags || ""} />

        {/* Selected Tags Display Bar with Framer Motion layoutId */}
        <motion.div
          ref={selectedsContainerRef}
          layout
          className={`w-full flex items-center justify-start gap-2 bg-white border ${
            errors.tags ? "border-people ring-1 ring-people/30" : "border-line"
          } min-h-14 rounded-2xl p-2 overflow-x-auto no-scrollbar shadow-2xs`}
        >
          {selectedTagList.length === 0 ? (
            <span className="text-xs text-mute pl-3">
              Click theme tags below or type a custom tag...
            </span>
          ) : (
            <AnimatePresence mode="popLayout">
              {selectedTagList.map((tag) => (
                <motion.div
                  key={tag.id}
                  layoutId={`form-tag-${tag.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-white shadow-xs border border-line h-full shrink-0 rounded-xl"
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                    aria-hidden="true"
                  />
                  <motion.span
                    layoutId={`form-tag-${tag.id}-label`}
                    className="text-xs font-semibold text-ink whitespace-nowrap"
                  >
                    {tag.label}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    aria-label={`Remove ${tag.label}`}
                    className="p-1 rounded-full text-mute hover:text-people hover:bg-soft transition cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {selectedTagList.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ target: { name: "tags", value: "" } })}
              className="ml-auto shrink-0 pr-3 text-xs font-semibold text-people hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </motion.div>

        {/* Available Suggested Theme Tags Palette */}
        <div className="mt-2.5 rounded-2xl border border-line bg-soft/40 p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-mute">
            <span>Theme Suggestions</span>
            <span>{selectedTagList.length}/10 selected</span>
          </div>

          <motion.div layout className="flex flex-wrap gap-2">
            {THEME_ISSUE_TAGS.filter(
              (tag) => !selectedTagList.some((sel) => sel.id === tag.id)
            ).map((tag) => (
              <motion.button
                key={tag.id}
                type="button"
                layoutId={`form-tag-${tag.id}`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => addTag(tag.id)}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-soft border border-line hover:border-ink/40 transition-all rounded-xl shrink-0 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: tag.color }}
                  aria-hidden="true"
                />
                <motion.span
                  layoutId={`form-tag-${tag.id}-label`}
                  className="text-xs font-medium text-ink tracking-wide"
                >
                  {tag.label}
                </motion.span>
                <Plus className="h-3 w-3 text-mute group-hover:text-ink transition-colors" />
              </motion.button>
            ))}
          </motion.div>

          {/* Custom Tag Input */}
          <div className="pt-2 border-t border-line/60 flex items-center gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={handleCustomSubmit}
              placeholder="Or type a custom issue tag (e.g. mangrove, eco-art)..."
              className="flex-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-ink outline-none placeholder:text-mute/60 focus:border-forest focus:ring-1 focus:ring-forest"
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              disabled={!customTag.trim()}
              className="rounded-xl bg-forest px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Add tag
            </button>
          </div>
        </div>
      </Field>
    </div>
  );
}
