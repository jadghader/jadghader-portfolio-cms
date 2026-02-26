import { getData } from "../firebase/firestore";

export const normalizeEmail = (email?: string | null): string =>
  (email || "").trim().toLowerCase();

export const getAllowedEditorEmails = async (): Promise<string[]> => {
  const docData = await getData("security", "contentEditors");
  if (!docData || !Array.isArray(docData.emails)) return [];
  return docData.emails
    .filter((value: unknown) => typeof value === "string")
    .map((value: string) => normalizeEmail(value));
};

export const isAllowedEditorEmail = async (email?: string | null): Promise<boolean> => {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const allowed = await getAllowedEditorEmails();
  return allowed.includes(normalized);
};
