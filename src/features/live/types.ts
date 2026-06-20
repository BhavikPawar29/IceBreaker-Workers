export type FirestoreValue = {
  booleanValue?: boolean;
  integerValue?: string;
  stringValue?: string;
};

export type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
};

export type FirestoreRunQueryResult = {
  document?: FirestoreDocument;
};

export type LivePrompt = {
  id: string;
  pack: string;
  situation: string;
  text: string;
};

