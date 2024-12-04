export function isHexValid(hex: string) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

export function hexToRgb(hex: string) {
  if (!isHexValid(hex)) {
    throw new Error("Invalid hex");
  }
  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

export function hexToRgba(hex: string, alpha: number) {
  if (!isHexValid(hex)) {
    throw new Error("Invalid hex");
  }
  if (alpha < 0 || alpha > 1) {
    throw new Error("Invalid alpha");
  }
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
