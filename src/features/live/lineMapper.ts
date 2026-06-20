import { CATEGORY_TO_PACK } from "./constants";
import type { FirestoreDocument, FirestoreValue, LivePrompt } from "./types";

function getStringField(
  fields: Record<string, FirestoreValue> | undefined,
  key: string,
): string {
  return fields?.[key]?.stringValue || "";
}

function getDocumentId(name: string): string {
  return name.split("/").pop() || "";
}

export function mapLine(document: FirestoreDocument): LivePrompt | null {
  const text = getStringField(document.fields, "text");

  if (!text) {
    return null;
  }

  return {
    id: getDocumentId(document.name),
    pack:
      getStringField(document.fields, "pack") ||
      CATEGORY_TO_PACK[getStringField(document.fields, "category")] ||
      "playful",
    situation: getStringField(document.fields, "situation") || "any",
    text,
  };
}

