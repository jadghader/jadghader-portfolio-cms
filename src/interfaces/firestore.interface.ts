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
