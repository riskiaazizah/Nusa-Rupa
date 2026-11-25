/**
 * Utility function for combining CSS class names (shadcn standard)
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
