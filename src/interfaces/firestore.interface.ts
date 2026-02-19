// ─── Reusable Types ────────────────────────────────────────────────────────

export interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

// ─── Navbar Document ───────────────────────────────────────────────────────

export interface NavbarDoc {
  resumeUrl: string;
  navLinks: Link[];
}

// ─── Hero Document ─────────────────────────────────────────────────────────

export interface HeroDoc {
  heroText: string;
  infoText: string;
  yearsOfExperience: number;
  socialLinks: SocialLink[];
}

// ─── About Document ────────────────────────────────────────────────────────

export interface Stat {
  icon: string;
  label: string;
  sub: string;
}

export interface AboutDoc {
  sectionTitle: string;
  content: string;
  yearsOfExperience: number;
  stats: Stat[];
  highlights: Highlight[];
}

// ─── Experience Document ───────────────────────────────────────────────────

export interface WorkExperience {
  id: number;
  company: string;
  initials: string;
  image?: string;
  role: string;
  type: string;
  duration: string;
  period: string;
  location: string;
  logoGradStart: string;
  logoGradEnd: string;
  accentColor: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface ExperienceDoc {
  sectionTitle: string;
  subtitle: string;
  items: WorkExperience[];
}

// ─── Skills Document ───────────────────────────────────────────────────────

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface SkillsDoc {
  sectionTitle: string;
  description: string;
  categories: SkillCategory[];
}

// ─── Projects Document ─────────────────────────────────────────────────────

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  accentStart: string;
  accentEnd: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface ProjectsDoc {
  sectionTitle: string;
  description: string;
  projects: Project[];
}

// ─── Contact Document ──────────────────────────────────────────────────────

export interface ContactDoc {
  sectionTitle: string;
  description: string;
  subtitle: string;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks: SocialLink[];
  formSubmissionEmail?: string;
}

// ─── Footer Document ───────────────────────────────────────────────────────

export interface FooterSection {
  title: string;
  links: Link[];
}

export interface FooterDoc {
  copyrightText: string;
  companyDescription: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
}

// ─── Legacy Types (for backward compatibility) ────────────────────────────

export interface skills {
  icon: string;
  name: string;
}
export interface skillsData {
  category: string;
  skills: skills[];
}
export interface skillsSection {
  skillsData: skillsData[];
}
export interface projectsData {
  description: string;
  images: string[];
  title: string;
}
export interface projectSection {
  projects: projectsData[];
}
export interface socialLinks {
  name: string;
  url: string;
}

export interface heroSection {
  heroText: string;
  infoText: string;
  socialLinks: socialLinks[];
}
export interface workExperienceData {
  company: string;
  description: string;
  location: string;
  title: string;
  companyLogo: string;
}
export interface experienceSection {
  workExperienceData: workExperienceData[];
}
