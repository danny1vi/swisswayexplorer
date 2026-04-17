export function truncateText(text: string | null | undefined, maxLength: number) {
  const value = (text || "").trim();
  if (!value || value.length <= maxLength) {
    return value;
  }

  const normalized = value.slice(0, maxLength + 1).replace(/\s+/g, " ").trim();
  const boundary = normalized.lastIndexOf(" ");
  const shortened = boundary > Math.floor(maxLength * 0.6) ? normalized.slice(0, boundary) : normalized.slice(0, maxLength);
  return `${shortened.trim()}...`;
}
