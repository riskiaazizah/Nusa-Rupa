const TIME_ZONE = "Asia/Makassar";

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: TIME_ZONE });
const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

export const formatDate = (value) => dateFormat.format(new Date(value));
export const formatDateTime = (value) => dateTimeFormat.format(new Date(value));

// Tautan eksternal dari user hanya boleh http/https (mencegah "javascript:" dsb.)
export function isSafeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}