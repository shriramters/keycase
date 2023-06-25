export const themes = ["sakura", "sakura-night", "tokyo-night"] as const
export type Theme = (typeof themes)[number]
