import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getData } from "../firebase/firestore";
import type { CMSDocId } from "../utils/cmsValidation";
import type {
  NavbarDoc,
  HeroDoc,
  AboutDoc,
  ExperienceDoc,
  ProjectsDoc,
  SkillsDoc,
  ContactDoc,
  FooterDoc,
} from "../interfaces/firestore.interface";

export type SiteContentMap = {
  navbar?: NavbarDoc | null;
  hero?: HeroDoc | null;
  about?: AboutDoc | null;
  experience?: ExperienceDoc | null;
  projects?: ProjectsDoc | null;
  skills?: SkillsDoc | null;
  contact?: ContactDoc | null;
  footer?: FooterDoc | null;
};

const docIds: CMSDocId[] = [
  "navbar",
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
  "footer",
];

interface SiteContentContextValue {
  docs: SiteContentMap;
  loaded: boolean;
  refreshDoc: <T extends CMSDocId>(docId: T) => Promise<SiteContentMap[T] | null>;
  refreshAll: () => Promise<void>;
  setDocLocal: (docId: CMSDocId, data: any) => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState<SiteContentMap>({});
  const [loaded, setLoaded] = useState(false);

  const refreshDoc = async <T extends CMSDocId>(docId: T): Promise<SiteContentMap[T] | null> => {
    const data = (await getData("siteContent", docId)) as SiteContentMap[T] | null;
    setDocs((prev) => ({ ...prev, [docId]: data }));
    return data;
  };

  const refreshAll = async () => {
    setLoaded(false);
    const results = await Promise.all(
      docIds.map(async (docId) => ({ docId, data: await getData("siteContent", docId) }))
    );
    const next: SiteContentMap = {};
    results.forEach(({ docId, data }) => {
      next[docId] = data;
    });
    setDocs(next);
    setLoaded(true);
  };

  const setDocLocal = (docId: CMSDocId, data: any) => {
    setDocs((prev) => ({ ...prev, [docId]: data }));
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await refreshAll();
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ docs, loaded, refreshDoc, refreshAll, setDocLocal }),
    [docs, loaded]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}
