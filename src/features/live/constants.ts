export const ALLOWED_PACKS = new Set(["playful", "deep", "flirty"]);
export const ALLOWED_SITUATIONS = new Set([
  "any",
  "date",
  "crush",
  "new-friends",
  "group-chat",
]);

export const CATEGORY_TO_PACK: Record<string, string> = {
  curious: "deep",
  deeper: "deep",
  playful: "playful",
  storytime: "deep",
  unexpected: "playful",
};

export const FIRESTORE_LIMIT = 24;
export const LEGACY_FIRESTORE_LIMIT = 200;

