"use client";

import { TagsSelector } from "@/components/ui/tags-selector";

const TAGS = [
  { id: "peatland", label: "Peatland" },
  { id: "forest-fire", label: "Forest Fire" },
  { id: "habitat-loss", label: "Habitat Loss" },
  { id: "endangered-species", label: "Endangered Species" },
  { id: "indigenous-rights", label: "Indigenous Rights" },
  { id: "climate-change", label: "Climate Change" },
  { id: "reforestation", label: "Reforestation" },
  { id: "sustainable-living", label: "Sustainable Living" },
];

export const TagsSelectorDemo = () => (
  <div style={{ padding: "20px", maxWidth: "600px", width: "100%" }}>
    <TagsSelector tags={TAGS} />
  </div>
);

export default TagsSelectorDemo;
