// DocumentContent interface for the entire document structure
export interface DocumentContent {
  id: string;
  heroSection: HeroSection;
  workExperience: WorkExperience[];
  projects: Project[];
  skillsCategory: SkillsCategory[];
}

// Individual section interfaces
export interface HeroSection {
  heroText: string;
  infoText: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
}

export interface Skill {
  icon: string;
  name: string;
}

export interface SkillsCategory {
  category: string;
  skills: Skill[];
}
