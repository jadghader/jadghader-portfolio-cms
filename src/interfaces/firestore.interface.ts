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


export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

// ─── Navbar Document ───────────────────────────────────────────────────────

export interface NavbarDoc {
  resumeUrl: string;
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
  watchUrl?: string;
}

export interface ProjectsDoc {
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

export interface FooterDoc {
  companyDescription: string;
  socialLinks: SocialLink[];
}
