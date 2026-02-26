import type {
  AboutDoc,
  ContactDoc,
  ExperienceDoc,
  FooterDoc,
  HeroDoc,
  NavbarDoc,
  ProjectsDoc,
  SkillsDoc,
} from "../interfaces/firestore.interface";

export type CMSDocId =
  | "navbar"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact"
  | "footer";

export interface ValidationIssue {
  level: "error" | "warning";
  path: string;
  message: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";

const isUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const pushIssue = (
  issues: ValidationIssue[],
  level: ValidationIssue["level"],
  path: string,
  message: string
) => issues.push({ level, path, message });

const validateLinksAndImages = (data: unknown, basePath = "$"): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  const walk = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }

    if (!isObject(value)) return;

    Object.entries(value).forEach(([key, nested]) => {
      const nextPath = `${path}.${key}`;
      if (typeof nested === "string") {
        const lowerKey = key.toLowerCase();
        if (
          (lowerKey.includes("url") ||
            lowerKey.includes("href") ||
            lowerKey.includes("link")) &&
          nested.trim() &&
          !isUrl(nested)
        ) {
          pushIssue(issues, "warning", nextPath, "Invalid URL format.");
        }
        if (lowerKey.includes("image") && nested.trim() && !isUrl(nested) && !nested.startsWith("/")) {
          pushIssue(
            issues,
            "warning",
            nextPath,
            "Image path should be an absolute URL or start with '/'."
          );
        }
      } else {
        walk(nested, nextPath);
      }
    });
  };

  walk(data, basePath);
  return issues;
};

const validateNavbar = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<NavbarDoc>;
  if (!isString(doc.resumeUrl)) pushIssue(issues, "error", "$.resumeUrl", "resumeUrl must be a string.");
  return issues;
};

const validateHero = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<HeroDoc>;
  if (!isString(doc.heroText)) pushIssue(issues, "error", "$.heroText", "heroText must be a string.");
  if (!isString(doc.infoText)) pushIssue(issues, "error", "$.infoText", "infoText must be a string.");
  if (!isNumber(doc.yearsOfExperience))
    pushIssue(issues, "error", "$.yearsOfExperience", "yearsOfExperience must be a number.");
  if (!Array.isArray(doc.socialLinks))
    pushIssue(issues, "error", "$.socialLinks", "socialLinks must be an array.");
  return issues;
};

const validateAbout = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<AboutDoc>;
  if (!isString(doc.sectionTitle))
    pushIssue(issues, "error", "$.sectionTitle", "sectionTitle must be a string.");
  if (!isString(doc.content)) pushIssue(issues, "error", "$.content", "content must be a string.");
  if (!isNumber(doc.yearsOfExperience))
    pushIssue(issues, "error", "$.yearsOfExperience", "yearsOfExperience must be a number.");
  if (!Array.isArray(doc.stats)) pushIssue(issues, "error", "$.stats", "stats must be an array.");
  if (!Array.isArray(doc.highlights))
    pushIssue(issues, "error", "$.highlights", "highlights must be an array.");
  return issues;
};

const validateExperience = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<ExperienceDoc>;
  if (!isString(doc.sectionTitle))
    pushIssue(issues, "error", "$.sectionTitle", "sectionTitle must be a string.");
  if (!isString(doc.subtitle)) pushIssue(issues, "error", "$.subtitle", "subtitle must be a string.");
  if (!Array.isArray(doc.items)) pushIssue(issues, "error", "$.items", "items must be an array.");
  return issues;
};

const validateProjects = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<ProjectsDoc>;
  if (!isString(doc.description))
    pushIssue(issues, "error", "$.description", "description must be a string.");
  if (!Array.isArray(doc.projects))
    pushIssue(issues, "error", "$.projects", "projects must be an array.");
  return issues;
};

const validateSkills = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<SkillsDoc>;
  if (!isString(doc.sectionTitle))
    pushIssue(issues, "error", "$.sectionTitle", "sectionTitle must be a string.");
  if (!isString(doc.description))
    pushIssue(issues, "error", "$.description", "description must be a string.");
  if (!Array.isArray(doc.categories))
    pushIssue(issues, "error", "$.categories", "categories must be an array.");
  return issues;
};

const validateContact = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<ContactDoc>;
  if (!isString(doc.sectionTitle))
    pushIssue(issues, "error", "$.sectionTitle", "sectionTitle must be a string.");
  if (!isString(doc.description))
    pushIssue(issues, "error", "$.description", "description must be a string.");
  if (!isString(doc.subtitle))
    pushIssue(issues, "error", "$.subtitle", "subtitle must be a string.");
  if (!Array.isArray(doc.socialLinks))
    pushIssue(issues, "error", "$.socialLinks", "socialLinks must be an array.");
  return issues;
};

const validateFooter = (data: unknown): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  if (!isObject(data)) {
    pushIssue(issues, "error", "$", "Document must be an object.");
    return issues;
  }
  const doc = data as Partial<FooterDoc>;
  if (!isString(doc.companyDescription))
    pushIssue(issues, "error", "$.companyDescription", "companyDescription must be a string.");
  if (!Array.isArray(doc.socialLinks))
    pushIssue(issues, "error", "$.socialLinks", "socialLinks must be an array.");
  return issues;
};

export const validateCMSDocument = (docId: CMSDocId, data: unknown): ValidationIssue[] => {
  const validators: Record<CMSDocId, (value: unknown) => ValidationIssue[]> = {
    navbar: validateNavbar,
    hero: validateHero,
    about: validateAbout,
    experience: validateExperience,
    projects: validateProjects,
    skills: validateSkills,
    contact: validateContact,
    footer: validateFooter,
  };

  return [...validators[docId](data), ...validateLinksAndImages(data)];
};
