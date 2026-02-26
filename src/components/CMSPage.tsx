import { useCallback, useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { getData, setData } from "../firebase/firestore";
import { badgeMixin, gradientBgMixin, gradientTextMixin } from "../styles/mixins";

type CMSDocId =
  | "navbar"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact"
  | "footer";

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

const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  padding: 2rem 1.25rem;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Badge = styled.span`
  ${badgeMixin};
`;

const Title = styled.h1`
  margin: 0.4rem 0 0;
  font-size: clamp(1.5rem, 3.5vw, 2.3rem);
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const TitleAccent = styled.span`
  ${gradientTextMixin};
`;

const Shell = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 280px 1fr;
  }
`;

const Card = styled.section`
  background: ${({ theme }) => theme.backgroundCard};
  border: 1px solid ${({ theme }) => theme.borderCard};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadowCard};
  overflow: hidden;
`;

const SideHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderCard};
  font-weight: 700;
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const DocButton = styled.button<{ $active: boolean }>`
  border: none;
  text-align: left;
  border-radius: 10px;
  margin: 0.2rem;
  padding: 0.7rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? "#fff" : theme.foreground)};
  background: ${({ theme, $active }) =>
    $active ? theme.gradientPrimary : theme.background};
`;

const EditorWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 560px;
`;

const Toolbar = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderCard};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const DocTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
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
`;

const SecondaryBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  border-radius: 10px;
  padding: 0.65rem 0.95rem;
  font-weight: 700;
  cursor: pointer;
`;

const Editor = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 480px;
  border: none;
  resize: vertical;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.foreground};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.88rem;
  line-height: 1.5;
  padding: 1rem;
`;

const Hint = styled.p`
  margin: 0;
  padding: 0 1rem 1rem;
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.85rem;
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

const FieldLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.foreground};
`;

const Field = styled.input`
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  padding: 0.7rem 0.8rem;
`;

const Small = styled.p`
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.86rem;
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GoogleBtn = styled(SecondaryBtn)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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

const normalizeEmail = (email?: string | null): string =>
  (email || "").trim().toLowerCase();

export function CMSPage() {
  const [selectedDocId, setSelectedDocId] = useState<CMSDocId>("hero");
  const [editorValue, setEditorValue] = useState("");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authAction, setAuthAction] = useState<"email" | "google" | null>(null);
  const [authorizedUser, setAuthorizedUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const selectedDocLabel = useMemo(() => {
    return cmsDocItems.find((item) => item.id === selectedDocId)?.label || selectedDocId;
  }, [selectedDocId]);

  const readAllowedEmails = useCallback(async (): Promise<string[]> => {
    const docData = await getData("security", "contentEditors");
    if (!docData || !Array.isArray(docData.emails)) return [];
    return docData.emails
      .filter((value: unknown) => typeof value === "string")
      .map((value: string) => normalizeEmail(value));
  }, []);

  const isUserAllowed = useCallback(async (user: User): Promise<boolean> => {
    const allowedEmails = await readAllowedEmails();
    const currentEmail = normalizeEmail(user.email);
    return !!currentEmail && allowedEmails.includes(currentEmail);
  }, [readAllowedEmails]);

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

  const loadDoc = async (docId: CMSDocId) => {
    setLoadingDoc(true);
    setStatus("");
    setStatusError(false);
    try {
      const data = await getData("siteContent", docId);
      setEditorValue(JSON.stringify(data || {}, null, 2));
    } catch {
      setEditorValue("{}");
      setStatusError(true);
      setStatus("Failed to load document.");
    } finally {
      setLoadingDoc(false);
    }
  };

  useEffect(() => {
    if (!authorizedUser) return;
    loadDoc(selectedDocId);
  }, [authorizedUser, selectedDocId]);

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
      const parsed = JSON.parse(editorValue);
      await setData("siteContent", selectedDocId, parsed);
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
              <Small>
                Sign in with an allowed email.
              </Small>
            </LoginTop>

            <LoginGrid>
              <FieldLabel htmlFor="cms-email">Email</FieldLabel>
              <Field
                id="cms-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authAction !== null}
              />

              <FieldLabel htmlFor="cms-password">Password</FieldLabel>
              <Field
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

  return (
    <Page>
      <Container>
        <Header>
          <div>
            <Badge>Admin</Badge>
            <Title>
              Portfolio <TitleAccent>CMS</TitleAccent>
            </Title>
            <Small>Signed in as {authorizedUser.email}</Small>
          </div>
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
                  <SecondaryBtn type="button" onClick={() => loadDoc(selectedDocId)}>
                    Reload
                  </SecondaryBtn>
                  <PrimaryBtn type="button" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </PrimaryBtn>
                </Actions>
              </Toolbar>
              <Editor
                value={editorValue}
                onChange={(e) => setEditorValue(e.target.value)}
                spellCheck={false}
              />
              <Hint>
                {loadingDoc
                  ? "Loading document..."
                  : "Edit JSON and click Save to update Firestore."}
              </Hint>
              {status && <Hint style={{ color: statusError ? "#ef4444" : undefined }}>{status}</Hint>}
            </EditorWrap>
          </Card>
        </Shell>
      </Container>
    </Page>
  );
}
