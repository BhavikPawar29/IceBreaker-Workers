import { FIRESTORE_LIMIT, LEGACY_FIRESTORE_LIMIT } from "./constants";
import { mapLine } from "./lineMapper";
import type { FirestoreRunQueryResult, LivePrompt } from "./types";

function queryApprovedLinesBody(pack: string, situation: string): unknown {
  return {
    structuredQuery: {
      from: [{ collectionId: "lines" }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "approved" },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: "pack" },
                op: "EQUAL",
                value: { stringValue: pack },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: "situation" },
                op: "EQUAL",
                value: { stringValue: situation },
              },
            },
          ],
        },
      },
      limit: FIRESTORE_LIMIT,
    },
  };
}

function queryApprovedLegacyLinesBody(): unknown {
  return {
    structuredQuery: {
      from: [{ collectionId: "lines" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "status" },
          op: "EQUAL",
          value: { stringValue: "approved" },
        },
      },
      limit: LEGACY_FIRESTORE_LIMIT,
    },
  };
}

async function runFirestoreQuery(
  projectId: string,
  body: unknown,
  errorLabel: string,
): Promise<LivePrompt[]> {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`${errorLabel} failed with ${response.status}`);
  }

  const results = (await response.json()) as FirestoreRunQueryResult[];

  return results
    .map((result) => (result.document ? mapLine(result.document) : null))
    .filter((prompt): prompt is LivePrompt => Boolean(prompt));
}

export function fetchApprovedLines(
  projectId: string,
  pack: string,
  situation: string,
): Promise<LivePrompt[]> {
  return runFirestoreQuery(
    projectId,
    queryApprovedLinesBody(pack, situation),
    "Firestore runQuery",
  );
}

export async function fetchLegacyLines(
  projectId: string,
  pack: string,
  situation: string,
): Promise<LivePrompt[]> {
  const prompts = await runFirestoreQuery(
    projectId,
    queryApprovedLegacyLinesBody(),
    "Firestore legacy runQuery",
  );

  return prompts.filter(
    (prompt) =>
      prompt.pack === pack &&
      (prompt.situation === situation || prompt.situation === "any"),
  );
}

