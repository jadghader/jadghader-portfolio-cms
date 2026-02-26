import { useCallback, useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import {
  onIdTokenChanged,
  type User,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { setData } from "../firebase/firestore";
import { useSiteContent } from "../context/SiteContentContext";
import { badgeMixin, gradientBgMixin, gradientTextMixin } from "../styles/mixins";
import { isAllowedEditorEmail } from "../utils/cmsAccess";
import {
  type CMSDocId,
  type ValidationIssue,
  validateCMSDocument,
} from "../utils/cmsValidation";

const cmsDocItems: Array<{ id: CMSDocId; label: string }> = [
  { id: "navbar", label: "Navbar" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer" },
];

const defaultDocById: Record<CMSDocId, Record<string, any>> = {
  navbar: { resumeUrl: "" },
  hero: { heroText: "", infoText: "", yearsOfExperience: 0, socialLinks: [] },
  about: {
    sectionTitle: "",
    content: "",
    yearsOfExperience: 0,
    stats: [],
    highlights: [],
  },
  experience: { sectionTitle: "", subtitle: "", items: [] },
  projects: { description: "", projects: [] },
  skills: { sectionTitle: "", description: "", categories: [] },
  contact: {
    sectionTitle: "",
    description: "",
    subtitle: "",
    email: "",
    phone: "",
    location: "",
    formSubmissionEmail: "",
    socialLinks: [],
  },
  footer: { companyDescription: "", socialLinks: [] },
};

const asObject = (value: unknown): Record<string, any> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const parseJson = (text: string): unknown => JSON.parse(text);

const stringifyJson = (value: unknown): string => JSON.stringify(value ?? {}, null, 2);

const Page = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(
      900px 420px at -10% -10%,
      ${({ theme }) =>
        theme.isDark ? "rgba(59,130,246,0.14)" : "rgba(59,130,246,0.1)"},
      transparent 60%
    ),
    radial-gradient(
      800px 400px at 120% 0%,
      ${({ theme }) =>
        theme.isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.09)"},
      transparent 62%
    ),
    ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  padding: 2rem 1.25rem 2.5rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) =>
    theme.isDark ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.8)"};
  backdrop-filter: blur(8px);
`;

const HeaderLeft = styled.div``;

const Badge = styled.span`
  ${badgeMixin};
`;

const Title = styled.h1`
  margin: 0.4rem 0 0;
  font-size: clamp(1.4rem, 3.5vw, 2.15rem);
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const TitleAccent = styled.span`
  ${gradientTextMixin};
`;

const Small = styled.p`
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.86rem;
  margin: 0.35rem 0 0;
`;

const Shell = styled.div`
  display: grid;
  gap: 1.15rem;
  grid-template-columns: 1fr;

  @media (min-width: 1050px) {
    grid-template-columns: 290px 1fr;
  }
`;

const Card = styled.section`
  background: ${({ theme }) => theme.backgroundCard};
  border: 1px solid ${({ theme }) => theme.borderCard};
  border-radius: 18px;
  box-shadow: ${({ theme }) => theme.shadowCard};
  overflow: hidden;
`;

const SideHeader = styled.div`
  padding: 0.9rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderCard};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.foregroundMuted};
  font-weight: 700;
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.65rem;
`;

const DocButton = styled.button<{ $active: boolean }>`
  border: 1px solid
    ${({ theme, $active }) => ($active ? "transparent" : theme.borderCard)};
  text-align: left;
  border-radius: 12px;
  margin: 0.2rem;
  padding: 0.72rem 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? "#fff" : theme.foreground)};
  background: ${({ theme, $active }) =>
    $active ? theme.gradientPrimary : theme.background};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const EditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 640px;
`;

const Toolbar = styled.div`
  padding: 0.95rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderCard};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const DocTitle = styled.h2`
  margin: 0;
  font-size: 1.02rem;
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PrimaryBtn = styled.button`
  ${gradientBgMixin};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.65rem 0.95rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  border-radius: 10px;
  padding: 0.65rem 0.95rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ModeBar = styled.div`
  display: flex;
  gap: 0.45rem;
  margin: 0.75rem 1rem 0.35rem;
`;

const ModeBtn = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ theme, $active }) => ($active ? theme.primary : theme.borderCard)};
  background: ${({ theme, $active }) =>
    $active ? (theme.isDark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.12)") : theme.background};
  color: ${({ theme }) => theme.foreground};
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
`;

const Editor = styled.textarea`
  width: calc(100% - 2rem);
  margin: 0.45rem 1rem 0;
  flex: 1;
  min-height: 420px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  border-radius: 12px;
  resize: vertical;
  outline: none;
  background: ${({ theme }) =>
    theme.isDark ? "rgba(2,6,23,0.55)" : "rgba(248,250,252,0.9)"};
  color: ${({ theme }) => (theme.isDark ? "#dbeafe" : theme.foreground)};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.86rem;
  line-height: 1.55;
  padding: 1rem 1.1rem;
`;

const FormPanel = styled.div`
  margin: 0.45rem 1rem 0;
  border: 1px solid ${({ theme }) => theme.borderCard};
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  padding: 0.85rem;
  display: grid;
  gap: 0.8rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 780px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.foregroundMuted};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
  color: ${({ theme }) => theme.foreground};
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  font-size: 0.86rem;
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
  color: ${({ theme }) => theme.foreground};
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  min-height: 96px;
  resize: vertical;
  font-size: 0.86rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
`;

const TinyBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundCard};
  color: ${({ theme }) => theme.foreground};
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
`;

const DangerBtn = styled(TinyBtn)`
  border-color: rgba(220, 38, 38, 0.45);
  color: #ef4444;
`;

const ItemCard = styled.div`
  border: 1px dashed ${({ theme }) => theme.borderCard};
  border-radius: 10px;
  padding: 0.7rem;
  display: grid;
  gap: 0.65rem;
`;

const Hint = styled.p`
  margin: 0;
  padding: 0 1rem 0.95rem;
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.82rem;
`;

const ValidationPanel = styled.div`
  margin: 0.25rem 1rem 0.55rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.background};
  overflow: hidden;
`;

const ValidationHeader = styled.div`
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderCard};
  font-size: 0.8rem;
  font-weight: 700;
`;

const ValidationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.5rem 0.8rem;
  display: grid;
  gap: 0.35rem;
`;

const ValidationItem = styled.li<{ $level: "error" | "warning" }>`
  font-size: 0.78rem;
  color: ${({ theme, $level }) =>
    $level === "error" ? "#dc2626" : theme.foregroundMuted};
`;

const MetaCard = styled.div`
  margin: 0.2rem 1rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.borderCard};
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  padding: 0.75rem;
`;

const MetaTitle = styled.h4`
  margin: 0 0 0.45rem;
  font-size: 0.8rem;
`;

const ValidationWrap = styled.div`
  margin-top: 0.7rem;
`;

const EditorStatusCard = styled.div<{ $error?: boolean }>`
  margin: 0.2rem 1rem 0.95rem;
  border-radius: 12px;
  border: 1px solid
    ${({ $error }) => ($error ? "rgba(239,68,68,0.35)" : "rgba(22,163,74,0.35)")};
  background: ${({ theme, $error }) =>
    $error
      ? theme.isDark
        ? "rgba(127,29,29,0.25)"
        : "rgba(254,226,226,0.9)"
      : theme.isDark
        ? "rgba(20,83,45,0.28)"
        : "rgba(220,252,231,0.9)"};
  padding: 0.72rem 0.82rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.foreground};
`;

const LoginCard = styled(motion.section)`
  max-width: 520px;
  margin: 3rem auto 0;
  background: ${({ theme }) => theme.backgroundCard};
  border: 1px solid ${({ theme }) => theme.borderCard};
  box-shadow: ${({ theme }) => theme.shadowCard};
  border-radius: 22px;
  padding: 1.5rem;
`;

const LoginTop = styled.div`
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${({ theme }) =>
    theme.isDark ? "rgba(99, 102, 241, 0.16)" : "rgba(99, 102, 241, 0.09)"};
  border: 1px solid ${({ theme }) => theme.borderCard};
`;

const LoginGrid = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const LoginActions = styled.div`
  margin-top: 0.9rem;
  display: grid;
  gap: 0.6rem;
`;

const LoginBtn = styled(PrimaryBtn)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
`;

const GoogleBtn = styled(SecondaryBtn)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.borderCard};
  }
`;

const GoogleLogo = styled.svg`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const BtnLoader = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: ${spin} 0.7s linear infinite;
`;

const LoginErrorCard = styled(motion.div)`
  margin-top: 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: ${({ theme }) =>
    theme.isDark ? "rgba(127, 29, 29, 0.25)" : "rgba(254, 226, 226, 0.9)"};
  padding: 0.8rem 0.9rem;
`;

const LoginErrorTitle = styled.p`
  margin: 0 0 0.2rem;
  color: #dc2626;
  font-size: 0.84rem;
  font-weight: 700;
`;

const LoginErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.foreground};
  font-size: 0.84rem;
`;

const LoadingWrap = styled(motion.section)`
  max-width: 520px;
  margin: 4rem auto 0;
  background: ${({ theme }) => theme.backgroundCard};
  border: 1px solid ${({ theme }) => theme.borderCard};
  box-shadow: ${({ theme }) => theme.shadowCard};
  border-radius: 22px;
  padding: 1.5rem;
`;

const LoadingTop = styled.div`
  border-radius: 14px;
  padding: 1rem;
  background: ${({ theme }) =>
    theme.isDark ? "rgba(99, 102, 241, 0.16)" : "rgba(99, 102, 241, 0.09)"};
  border: 1px solid ${({ theme }) => theme.borderCard};
  margin-bottom: 1rem;
`;

const LoadingDots = styled.span`
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
`;

const Dot = styled(motion.span)`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background: ${({ theme }) => theme.primary};
`;

const updateAt = <T,>(items: T[], index: number, next: T): T[] => {
  const copy = [...items];
  copy[index] = next;
  return copy;
};

export function CMSPage() {
  const { docs, loaded, refreshDoc, setDocLocal } = useSiteContent();
  const [selectedDocId, setSelectedDocId] = useState<CMSDocId>("hero");
  const [mode, setMode] = useState<"visual" | "json">("visual");
  const [editorValue, setEditorValue] = useState("");
  const [workingData, setWorkingData] = useState<Record<string, any>>(defaultDocById.hero);
  const [reloading, setReloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [authAction, setAuthAction] = useState<"email" | "google" | null>(null);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadedDocText, setLoadedDocText] = useState("");

  const selectedDocLabel = useMemo(
    () => cmsDocItems.find((item) => item.id === selectedDocId)?.label || selectedDocId,
    [selectedDocId]
  );

  const isUserAllowed = useCallback(async (user: User): Promise<boolean> => {
    return isAllowedEditorEmail(user.email);
  }, []);

  const applyData = useCallback(
    (nextData: Record<string, any>) => {
      setWorkingData(nextData);
      const nextText = stringifyJson(nextData);
      setEditorValue(nextText);
      setValidationIssues(validateCMSDocument(selectedDocId, nextData));
    },
    [selectedDocId]
  );

  const parseAndValidate = useCallback(
    (value: string): { parsed: Record<string, any> | null; issues: ValidationIssue[] } => {
      try {
        const parsed = asObject(parseJson(value));
        return { parsed, issues: validateCMSDocument(selectedDocId, parsed) };
      } catch (error) {
        const syntaxMessage =
          error instanceof SyntaxError ? error.message : "Invalid JSON payload.";
        return {
          parsed: null,
          issues: [{ level: "error", path: "$", message: syntaxMessage }],
        };
      }
    },
    [selectedDocId]
  );

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setAuthLoading(true);

      if (!currentUser) {
        setAuthorizedUser(null);
        setAuthAction(null);
        setAuthLoading(false);
        return;
      }

      try {
        const allowed = await isUserAllowed(currentUser);
        if (!allowed) {
          await signOut(auth);
          setAuthorizedUser(null);
          setAuthAction(null);
          setStatusError(true);
          setStatus("Access denied: you are not authorized to access the CMS.");
        } else {
          setAuthorizedUser(currentUser);
          setStatus("");
          setStatusError(false);
        }
      } catch {
        await signOut(auth);
        setAuthorizedUser(null);
        setAuthAction(null);
        setStatusError(true);
        setStatus("Failed to verify access. Please try again.");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isUserAllowed]);

  useEffect(() => {
    if (!authorizedUser || !loaded) return;
    const nextData = asObject(docs[selectedDocId] || defaultDocById[selectedDocId]);
    setWorkingData(nextData);
    const nextText = stringifyJson(nextData);
    setEditorValue(nextText);
    setLoadedDocText(nextText);
    setValidationIssues(validateCMSDocument(selectedDocId, nextData));
  }, [authorizedUser, docs, loaded, selectedDocId]);

  const handleEmailLogin = async () => {
    setStatus("");
    setStatusError(false);
    if (!email.trim() || !password) {
      setStatusError(true);
      setStatus("Email and password are required.");
      return;
    }
    setAuthAction("email");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setStatusError(true);
      setStatus("Email sign-in failed. Check your credentials.");
      setAuthAction(null);
    }
  };

  const handleGoogleLogin = async () => {
    setStatus("");
    setStatusError(false);
    setAuthAction("google");
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, googleProvider);
    } catch {
      setStatusError(true);
      setStatus("Google sign-in failed. Please try again.");
      setAuthAction(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("");
    setStatusError(false);

    try {
      const validation = parseAndValidate(editorValue);
      setValidationIssues(validation.issues);

      if (!validation.parsed) {
        throw new SyntaxError("Invalid JSON payload.");
      }

      const hardErrors = validation.issues.filter((item) => item.level === "error");
      if (hardErrors.length) {
        setStatusError(true);
        setStatus("Validation failed. Resolve errors before saving.");
        return;
      }

      const normalizedCurrent = stringifyJson(validation.parsed);
      if (normalizedCurrent === loadedDocText) {
        setStatus("No changes to save.");
        return;
      }

      await setData("siteContent", selectedDocId, validation.parsed);
      setDocLocal(selectedDocId, validation.parsed);
      setWorkingData(validation.parsed);
      setLoadedDocText(normalizedCurrent);
      setStatus(`Saved siteContent/${selectedDocId} successfully.`);
    } catch (error) {
      setStatusError(true);
      if (error instanceof SyntaxError) {
        setStatus("Invalid JSON. Fix format before saving.");
      } else {
        setStatus("Save failed. Check your permissions and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    if (!authorizedUser) return;
    setReloading(true);
    setStatus("");
    setStatusError(false);
    try {
      const data = await refreshDoc(selectedDocId);
      const nextData = asObject(data || defaultDocById[selectedDocId]);
      setWorkingData(nextData);
      const nextText = stringifyJson(nextData);
      setEditorValue(nextText);
      setLoadedDocText(nextText);
      setValidationIssues(validateCMSDocument(selectedDocId, nextData));
      setStatus(`Reloaded siteContent/${selectedDocId}.`);
    } catch {
      setStatusError(true);
      setStatus("Failed to reload document.");
    } finally {
      setReloading(false);
    }
  };

  const renderLinkEditor = (
    title: string,
    items: Array<Record<string, any>>,
    onChange: (next: Array<Record<string, any>>) => void
  ) => (
    <ItemCard>
      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: "0.82rem" }}>{title}</strong>
        <TinyBtn type="button" onClick={() => onChange([...items, { name: "", url: "", icon: "" }])}>
          + Add
        </TinyBtn>
      </Row>
      {items.map((item, index) => (
        <ItemCard key={`${title}-${index}`}>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={item.name || ""}
                onChange={(e) =>
                  onChange(updateAt(items, index, { ...item, name: e.target.value }))
                }
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>URL</FieldLabel>
              <Input
                value={item.url || ""}
                onChange={(e) =>
                  onChange(updateAt(items, index, { ...item, url: e.target.value }))
                }
              />
            </FieldWrap>
          </FormGrid>
          <FieldWrap>
            <FieldLabel>Icon (optional)</FieldLabel>
            <Input
              value={item.icon || ""}
              onChange={(e) =>
                onChange(updateAt(items, index, { ...item, icon: e.target.value }))
              }
            />
          </FieldWrap>
          <Row>
            <DangerBtn type="button" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              Remove
            </DangerBtn>
          </Row>
        </ItemCard>
      ))}
    </ItemCard>
  );

  const renderVisualEditor = () => {
    const data = workingData;

    if (selectedDocId === "navbar") {
      return (
        <FormPanel>
          <FieldWrap>
            <FieldLabel>Resume URL</FieldLabel>
            <Input
              value={data.resumeUrl || ""}
              onChange={(e) => applyData({ ...data, resumeUrl: e.target.value })}
            />
          </FieldWrap>
        </FormPanel>
      );
    }

    if (selectedDocId === "hero") {
      const socialLinks = asArray<Record<string, any>>(data.socialLinks);
      return (
        <FormPanel>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Hero Text</FieldLabel>
              <Input
                value={data.heroText || ""}
                onChange={(e) => applyData({ ...data, heroText: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Years of Experience</FieldLabel>
              <Input
                type="number"
                value={Number(data.yearsOfExperience || 0)}
                onChange={(e) =>
                  applyData({ ...data, yearsOfExperience: Number(e.target.value || 0) })
                }
              />
            </FieldWrap>
          </FormGrid>
          <FieldWrap>
            <FieldLabel>Info Text</FieldLabel>
            <TextArea
              value={data.infoText || ""}
              onChange={(e) => applyData({ ...data, infoText: e.target.value })}
            />
          </FieldWrap>
          {renderLinkEditor("Social Links", socialLinks, (next) =>
            applyData({ ...data, socialLinks: next })
          )}
        </FormPanel>
      );
    }

    if (selectedDocId === "about") {
      const stats = asArray<Record<string, any>>(data.stats);
      const highlights = asArray<Record<string, any>>(data.highlights);
      return (
        <FormPanel>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Section Title</FieldLabel>
              <Input
                value={data.sectionTitle || ""}
                onChange={(e) => applyData({ ...data, sectionTitle: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Years of Experience</FieldLabel>
              <Input
                type="number"
                value={Number(data.yearsOfExperience || 0)}
                onChange={(e) =>
                  applyData({ ...data, yearsOfExperience: Number(e.target.value || 0) })
                }
              />
            </FieldWrap>
          </FormGrid>
          <FieldWrap>
            <FieldLabel>Content</FieldLabel>
            <TextArea
              value={data.content || ""}
              onChange={(e) => applyData({ ...data, content: e.target.value })}
            />
          </FieldWrap>

          <ItemCard>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.82rem" }}>Stats</strong>
              <TinyBtn
                type="button"
                onClick={() => applyData({ ...data, stats: [...stats, { icon: "", label: "", sub: "" }] })}
              >
                + Add
              </TinyBtn>
            </Row>
            {stats.map((item, index) => (
              <ItemCard key={`stat-${index}`}>
                <FormGrid>
                  <FieldWrap>
                    <FieldLabel>Icon</FieldLabel>
                    <Input
                      value={item.icon || ""}
                      onChange={(e) =>
                        applyData({ ...data, stats: updateAt(stats, index, { ...item, icon: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                  <FieldWrap>
                    <FieldLabel>Label</FieldLabel>
                    <Input
                      value={item.label || ""}
                      onChange={(e) =>
                        applyData({ ...data, stats: updateAt(stats, index, { ...item, label: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                </FormGrid>
                <FieldWrap>
                  <FieldLabel>Sub</FieldLabel>
                  <Input
                    value={item.sub || ""}
                    onChange={(e) =>
                      applyData({ ...data, stats: updateAt(stats, index, { ...item, sub: e.target.value }) })
                    }
                  />
                </FieldWrap>
                <DangerBtn type="button" onClick={() => applyData({ ...data, stats: stats.filter((_, i) => i !== index) })}>
                  Remove
                </DangerBtn>
              </ItemCard>
            ))}
          </ItemCard>

          <ItemCard>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.82rem" }}>Highlights</strong>
              <TinyBtn
                type="button"
                onClick={() =>
                  applyData({
                    ...data,
                    highlights: [...highlights, { icon: "", title: "", description: "" }],
                  })
                }
              >
                + Add
              </TinyBtn>
            </Row>
            {highlights.map((item, index) => (
              <ItemCard key={`highlight-${index}`}>
                <FormGrid>
                  <FieldWrap>
                    <FieldLabel>Icon</FieldLabel>
                    <Input
                      value={item.icon || ""}
                      onChange={(e) =>
                        applyData({
                          ...data,
                          highlights: updateAt(highlights, index, { ...item, icon: e.target.value }),
                        })
                      }
                    />
                  </FieldWrap>
                  <FieldWrap>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={item.title || ""}
                      onChange={(e) =>
                        applyData({
                          ...data,
                          highlights: updateAt(highlights, index, { ...item, title: e.target.value }),
                        })
                      }
                    />
                  </FieldWrap>
                </FormGrid>
                <FieldWrap>
                  <FieldLabel>Description</FieldLabel>
                  <TextArea
                    value={item.description || ""}
                    onChange={(e) =>
                      applyData({
                        ...data,
                        highlights: updateAt(highlights, index, { ...item, description: e.target.value }),
                      })
                    }
                  />
                </FieldWrap>
                <DangerBtn
                  type="button"
                  onClick={() =>
                    applyData({ ...data, highlights: highlights.filter((_, i) => i !== index) })
                  }
                >
                  Remove
                </DangerBtn>
              </ItemCard>
            ))}
          </ItemCard>
        </FormPanel>
      );
    }

    if (selectedDocId === "experience") {
      const items = asArray<Record<string, any>>(data.items);
      return (
        <FormPanel>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Section Title</FieldLabel>
              <Input
                value={data.sectionTitle || ""}
                onChange={(e) => applyData({ ...data, sectionTitle: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Subtitle</FieldLabel>
              <Input
                value={data.subtitle || ""}
                onChange={(e) => applyData({ ...data, subtitle: e.target.value })}
              />
            </FieldWrap>
          </FormGrid>

          <ItemCard>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.82rem" }}>Experience Items</strong>
              <TinyBtn
                type="button"
                onClick={() =>
                  applyData({
                    ...data,
                    items: [
                      ...items,
                      {
                        id: Date.now(),
                        company: "",
                        initials: "",
                        role: "",
                        type: "",
                        duration: "",
                        period: "",
                        location: "",
                        logoGradStart: "",
                        logoGradEnd: "",
                        accentColor: "",
                        description: "",
                        highlights: [],
                        skills: [],
                      },
                    ],
                  })
                }
              >
                + Add
              </TinyBtn>
            </Row>
            {items.map((item, index) => {
              const highlights = asArray<string>(item.highlights);
              const skills = asArray<string>(item.skills);
              return (
                <ItemCard key={`exp-${index}`}>
                  <FormGrid>
                    <FieldWrap>
                      <FieldLabel>Company</FieldLabel>
                      <Input
                        value={item.company || ""}
                        onChange={(e) =>
                          applyData({ ...data, items: updateAt(items, index, { ...item, company: e.target.value }) })
                        }
                      />
                    </FieldWrap>
                    <FieldWrap>
                      <FieldLabel>Role</FieldLabel>
                      <Input
                        value={item.role || ""}
                        onChange={(e) =>
                          applyData({ ...data, items: updateAt(items, index, { ...item, role: e.target.value }) })
                        }
                      />
                    </FieldWrap>
                    <FieldWrap>
                      <FieldLabel>Type</FieldLabel>
                      <Input
                        value={item.type || ""}
                        onChange={(e) =>
                          applyData({ ...data, items: updateAt(items, index, { ...item, type: e.target.value }) })
                        }
                      />
                    </FieldWrap>
                    <FieldWrap>
                      <FieldLabel>Location</FieldLabel>
                      <Input
                        value={item.location || ""}
                        onChange={(e) =>
                          applyData({ ...data, items: updateAt(items, index, { ...item, location: e.target.value }) })
                        }
                      />
                    </FieldWrap>
                  </FormGrid>
                  <FieldWrap>
                    <FieldLabel>Description</FieldLabel>
                    <TextArea
                      value={item.description || ""}
                      onChange={(e) =>
                        applyData({ ...data, items: updateAt(items, index, { ...item, description: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                  <FormGrid>
                    <FieldWrap>
                      <FieldLabel>Highlights (comma separated)</FieldLabel>
                      <Input
                        value={highlights.join(", ")}
                        onChange={(e) =>
                          applyData({
                            ...data,
                            items: updateAt(items, index, {
                              ...item,
                              highlights: e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            }),
                          })
                        }
                      />
                    </FieldWrap>
                    <FieldWrap>
                      <FieldLabel>Skills (comma separated)</FieldLabel>
                      <Input
                        value={skills.join(", ")}
                        onChange={(e) =>
                          applyData({
                            ...data,
                            items: updateAt(items, index, {
                              ...item,
                              skills: e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            }),
                          })
                        }
                      />
                    </FieldWrap>
                  </FormGrid>
                  <DangerBtn type="button" onClick={() => applyData({ ...data, items: items.filter((_, i) => i !== index) })}>
                    Remove Item
                  </DangerBtn>
                </ItemCard>
              );
            })}
          </ItemCard>
        </FormPanel>
      );
    }

    if (selectedDocId === "projects") {
      const items = asArray<Record<string, any>>(data.projects);
      return (
        <FormPanel>
          <FieldWrap>
            <FieldLabel>Description</FieldLabel>
            <TextArea
              value={data.description || ""}
              onChange={(e) => applyData({ ...data, description: e.target.value })}
            />
          </FieldWrap>
          <ItemCard>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.82rem" }}>Projects</strong>
              <TinyBtn
                type="button"
                onClick={() =>
                  applyData({
                    ...data,
                    projects: [
                      ...items,
                      {
                        title: "",
                        description: "",
                        image: "",
                        tags: [],
                        accentStart: "",
                        accentEnd: "",
                        repoUrl: "",
                        liveUrl: "",
                        watchUrl: "",
                      },
                    ],
                  })
                }
              >
                + Add
              </TinyBtn>
            </Row>
            {items.map((item, index) => (
              <ItemCard key={`project-${index}`}>
                <FormGrid>
                  <FieldWrap>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={item.title || ""}
                      onChange={(e) =>
                        applyData({ ...data, projects: updateAt(items, index, { ...item, title: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                  <FieldWrap>
                    <FieldLabel>Image URL</FieldLabel>
                    <Input
                      value={item.image || ""}
                      onChange={(e) =>
                        applyData({ ...data, projects: updateAt(items, index, { ...item, image: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                </FormGrid>
                <FieldWrap>
                  <FieldLabel>Description</FieldLabel>
                  <TextArea
                    value={item.description || ""}
                    onChange={(e) =>
                      applyData({
                        ...data,
                        projects: updateAt(items, index, { ...item, description: e.target.value }),
                      })
                    }
                  />
                </FieldWrap>
                <FormGrid>
                  <FieldWrap>
                    <FieldLabel>Live URL</FieldLabel>
                    <Input
                      value={item.liveUrl || ""}
                      onChange={(e) =>
                        applyData({ ...data, projects: updateAt(items, index, { ...item, liveUrl: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                  <FieldWrap>
                    <FieldLabel>Repo URL</FieldLabel>
                    <Input
                      value={item.repoUrl || ""}
                      onChange={(e) =>
                        applyData({ ...data, projects: updateAt(items, index, { ...item, repoUrl: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                </FormGrid>
                <FormGrid>
                  <FieldWrap>
                    <FieldLabel>Watch URL</FieldLabel>
                    <Input
                      value={item.watchUrl || ""}
                      onChange={(e) =>
                        applyData({ ...data, projects: updateAt(items, index, { ...item, watchUrl: e.target.value }) })
                      }
                    />
                  </FieldWrap>
                  <FieldWrap>
                    <FieldLabel>Tags (comma separated)</FieldLabel>
                    <Input
                      value={asArray<string>(item.tags).join(", ")}
                      onChange={(e) =>
                        applyData({
                          ...data,
                          projects: updateAt(items, index, {
                            ...item,
                            tags: e.target.value
                              .split(",")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          }),
                        })
                      }
                    />
                  </FieldWrap>
                </FormGrid>
                <DangerBtn type="button" onClick={() => applyData({ ...data, projects: items.filter((_, i) => i !== index) })}>
                  Remove Project
                </DangerBtn>
              </ItemCard>
            ))}
          </ItemCard>
        </FormPanel>
      );
    }

    if (selectedDocId === "skills") {
      const categories = asArray<Record<string, any>>(data.categories);
      return (
        <FormPanel>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Section Title</FieldLabel>
              <Input
                value={data.sectionTitle || ""}
                onChange={(e) => applyData({ ...data, sectionTitle: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Description</FieldLabel>
              <Input
                value={data.description || ""}
                onChange={(e) => applyData({ ...data, description: e.target.value })}
              />
            </FieldWrap>
          </FormGrid>
          <ItemCard>
            <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "0.82rem" }}>Categories</strong>
              <TinyBtn
                type="button"
                onClick={() => applyData({ ...data, categories: [...categories, { category: "", skills: [] }] })}
              >
                + Add
              </TinyBtn>
            </Row>
            {categories.map((category, index) => {
              const skillItems = asArray<Record<string, any>>(category.skills);
              return (
                <ItemCard key={`cat-${index}`}>
                  <FieldWrap>
                    <FieldLabel>Category Name</FieldLabel>
                    <Input
                      value={category.category || ""}
                      onChange={(e) =>
                        applyData({
                          ...data,
                          categories: updateAt(categories, index, {
                            ...category,
                            category: e.target.value,
                          }),
                        })
                      }
                    />
                  </FieldWrap>
                  <ItemCard>
                    <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.8rem" }}>Skills</strong>
                      <TinyBtn
                        type="button"
                        onClick={() =>
                          applyData({
                            ...data,
                            categories: updateAt(categories, index, {
                              ...category,
                              skills: [...skillItems, { name: "", icon: "" }],
                            }),
                          })
                        }
                      >
                        + Add
                      </TinyBtn>
                    </Row>
                    {skillItems.map((skill, skillIndex) => (
                      <ItemCard key={`skill-${index}-${skillIndex}`}>
                        <FormGrid>
                          <FieldWrap>
                            <FieldLabel>Name</FieldLabel>
                            <Input
                              value={skill.name || ""}
                              onChange={(e) =>
                                applyData({
                                  ...data,
                                  categories: updateAt(categories, index, {
                                    ...category,
                                    skills: updateAt(skillItems, skillIndex, {
                                      ...skill,
                                      name: e.target.value,
                                    }),
                                  }),
                                })
                              }
                            />
                          </FieldWrap>
                          <FieldWrap>
                            <FieldLabel>Icon</FieldLabel>
                            <Input
                              value={skill.icon || ""}
                              onChange={(e) =>
                                applyData({
                                  ...data,
                                  categories: updateAt(categories, index, {
                                    ...category,
                                    skills: updateAt(skillItems, skillIndex, {
                                      ...skill,
                                      icon: e.target.value,
                                    }),
                                  }),
                                })
                              }
                            />
                          </FieldWrap>
                        </FormGrid>
                        <DangerBtn
                          type="button"
                          onClick={() =>
                            applyData({
                              ...data,
                              categories: updateAt(categories, index, {
                                ...category,
                                skills: skillItems.filter((_, i) => i !== skillIndex),
                              }),
                            })
                          }
                        >
                          Remove Skill
                        </DangerBtn>
                      </ItemCard>
                    ))}
                  </ItemCard>
                  <DangerBtn
                    type="button"
                    onClick={() => applyData({ ...data, categories: categories.filter((_, i) => i !== index) })}
                  >
                    Remove Category
                  </DangerBtn>
                </ItemCard>
              );
            })}
          </ItemCard>
        </FormPanel>
      );
    }

    if (selectedDocId === "contact") {
      const socialLinks = asArray<Record<string, any>>(data.socialLinks);
      return (
        <FormPanel>
          <FormGrid>
            <FieldWrap>
              <FieldLabel>Section Title</FieldLabel>
              <Input
                value={data.sectionTitle || ""}
                onChange={(e) => applyData({ ...data, sectionTitle: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Subtitle</FieldLabel>
              <Input
                value={data.subtitle || ""}
                onChange={(e) => applyData({ ...data, subtitle: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Email</FieldLabel>
              <Input
                value={data.email || ""}
                onChange={(e) => applyData({ ...data, email: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Phone</FieldLabel>
              <Input
                value={data.phone || ""}
                onChange={(e) => applyData({ ...data, phone: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Location</FieldLabel>
              <Input
                value={data.location || ""}
                onChange={(e) => applyData({ ...data, location: e.target.value })}
              />
            </FieldWrap>
            <FieldWrap>
              <FieldLabel>Form Submission Email</FieldLabel>
              <Input
                value={data.formSubmissionEmail || ""}
                onChange={(e) => applyData({ ...data, formSubmissionEmail: e.target.value })}
              />
            </FieldWrap>
          </FormGrid>
          <FieldWrap>
            <FieldLabel>Description</FieldLabel>
            <TextArea
              value={data.description || ""}
              onChange={(e) => applyData({ ...data, description: e.target.value })}
            />
          </FieldWrap>
          {renderLinkEditor("Social Links", socialLinks, (next) =>
            applyData({ ...data, socialLinks: next })
          )}
        </FormPanel>
      );
    }

    if (selectedDocId === "footer") {
      const socialLinks = asArray<Record<string, any>>(data.socialLinks);
      return (
        <FormPanel>
          <FieldWrap>
            <FieldLabel>Company Description</FieldLabel>
            <TextArea
              value={data.companyDescription || ""}
              onChange={(e) => applyData({ ...data, companyDescription: e.target.value })}
            />
          </FieldWrap>
          {renderLinkEditor("Social Links", socialLinks, (next) =>
            applyData({ ...data, socialLinks: next })
          )}
        </FormPanel>
      );
    }

    return null;
  };

  if (authLoading) {
    return (
      <Page>
        <Container>
          <LoadingWrap
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LoadingTop>
              <Badge>Admin</Badge>
              <Title>
                Portfolio <TitleAccent>CMS</TitleAccent>
              </Title>
              <Small>Verifying your access permissions...</Small>
            </LoadingTop>

            <Small style={{ display: "flex", alignItems: "center", gap: "0.55rem", margin: 0 }}>
              Checking CMS access
              <LoadingDots>
                {[0, 1, 2].map((i) => (
                  <Dot
                    key={i}
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.12,
                    }}
                  />
                ))}
              </LoadingDots>
            </Small>
          </LoadingWrap>
        </Container>
      </Page>
    );
  }

  if (!authorizedUser) {
    return (
      <Page>
        <Container>
          <LoginCard initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <LoginTop>
              <Badge>Admin</Badge>
              <Title>
                Portfolio <TitleAccent>CMS</TitleAccent>
              </Title>
              <Small>Sign in with an allowed email.</Small>
            </LoginTop>

            <LoginGrid>
              <FieldLabel htmlFor="cms-email">Email</FieldLabel>
              <Input
                id="cms-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authAction !== null}
              />

              <FieldLabel htmlFor="cms-password">Password</FieldLabel>
              <Input
                id="cms-password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authAction !== null}
              />
            </LoginGrid>

            <LoginActions>
              <LoginBtn type="button" onClick={handleEmailLogin} disabled={authAction !== null}>
                {authAction === "email" ? (
                  <>
                    <BtnLoader />
                    Verifying...
                  </>
                ) : (
                  "Sign In with Email"
                )}
              </LoginBtn>
              <Divider>or</Divider>
              <GoogleBtn type="button" onClick={handleGoogleLogin} disabled={authAction !== null}>
                <GoogleLogo viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.3 0 6.3 1.2 8.6 3.3l6.4-6.4C34.9 2.7 29.8.5 24 .5 14.8.5 6.9 5.8 3 13.6l7.9 6.1C12.8 13.8 17.9 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.6h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.9 28.3c-.5-1.4-.8-2.8-.8-4.3s.3-2.9.8-4.3L3 13.6C1.1 17.2 0 20.5 0 24s1.1 6.8 3 10.4l7.9-6.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 47.5c6.5 0 12-2.1 16-5.7l-7.6-5.9c-2.1 1.4-4.8 2.2-8.4 2.2-6.1 0-11.2-4.3-13.1-10.2L3 34.4C6.9 42.2 14.8 47.5 24 47.5z"
                  />
                </GoogleLogo>
                {authAction === "google" ? (
                  <>
                    <BtnLoader />
                    Connecting...
                  </>
                ) : (
                  "Continue with Google"
                )}
              </GoogleBtn>
            </LoginActions>
            {status && statusError && (
              <LoginErrorCard
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoginErrorTitle>Sign-in Failed</LoginErrorTitle>
                <LoginErrorText>{status}</LoginErrorText>
              </LoginErrorCard>
            )}
          </LoginCard>
        </Container>
      </Page>
    );
  }

  if (!loaded) {
    return (
      <Page>
        <Container>
          <LoadingWrap
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LoadingTop>
              <Badge>Admin</Badge>
              <Title>
                Portfolio <TitleAccent>CMS</TitleAccent>
              </Title>
              <Small>Loading CMS content...</Small>
            </LoadingTop>
          </LoadingWrap>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <HeaderLeft>
            <Badge>Admin</Badge>
            <Title>
              Portfolio <TitleAccent>CMS</TitleAccent>
            </Title>
            <Small>Signed in as {authorizedUser.email}</Small>
          </HeaderLeft>
          <SecondaryBtn type="button" onClick={() => signOut(auth)}>
            Sign Out
          </SecondaryBtn>
        </Header>

        <Shell>
          <Card>
            <SideHeader>Sections</SideHeader>
            <DocList>
              {cmsDocItems.map((item) => (
                <DocButton
                  key={item.id}
                  $active={selectedDocId === item.id}
                  onClick={() => setSelectedDocId(item.id)}
                >
                  {item.label}
                </DocButton>
              ))}
            </DocList>
          </Card>

          <Card>
            <EditorWrap>
              <Toolbar>
                <DocTitle>siteContent/{selectedDocLabel.toLowerCase()}</DocTitle>
                <Actions>
                  <SecondaryBtn type="button" onClick={handleReload} disabled={saving || reloading}>
                    {reloading ? "Reloading..." : "Reload"}
                  </SecondaryBtn>
                  <PrimaryBtn
                    type="button"
                    onClick={handleSave}
                    disabled={saving || reloading || validationIssues.some((item) => item.level === "error")}
                  >
                    {saving ? "Saving..." : "Save"}
                  </PrimaryBtn>
                </Actions>
              </Toolbar>

              <ModeBar>
                <ModeBtn $active={mode === "visual"} onClick={() => setMode("visual")}>Visual</ModeBtn>
                <ModeBtn $active={mode === "json"} onClick={() => setMode("json")}>Advanced JSON</ModeBtn>
              </ModeBar>

              {mode === "visual" ? (
                renderVisualEditor()
              ) : (
                <Editor
                  value={editorValue}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setEditorValue(nextValue);
                    const validation = parseAndValidate(nextValue);
                    setValidationIssues(validation.issues);
                    if (validation.parsed) setWorkingData(validation.parsed);
                  }}
                  spellCheck={false}
                />
              )}

              <ValidationWrap>
                <MetaCard>
                  <MetaTitle>Validation</MetaTitle>
                  <Small style={{ marginTop: 0 }}>
                    {validationIssues.length
                      ? `${validationIssues.filter((x) => x.level === "error").length} errors, ${validationIssues.filter((x) => x.level === "warning").length} warnings`
                      : "No validation issues."}
                  </Small>
                  {validationIssues.length > 0 && (
                    <ValidationPanel>
                      <ValidationHeader>Document checks</ValidationHeader>
                      <ValidationList>
                        {validationIssues.slice(0, 10).map((issue, index) => (
                          <ValidationItem key={`${issue.path}-${index}`} $level={issue.level}>
                            [{issue.level.toUpperCase()}] {issue.path}: {issue.message}
                          </ValidationItem>
                        ))}
                      </ValidationList>
                    </ValidationPanel>
                  )}
                </MetaCard>
              </ValidationWrap>

              <Hint>
                {reloading
                  ? "Loading document..."
                  : "Use Visual mode for faster editing or Advanced JSON for full control."}
              </Hint>
              {status && <EditorStatusCard $error={statusError}>{status}</EditorStatusCard>}
            </EditorWrap>
          </Card>

        </Shell>
      </Container>
    </Page>
  );
}
