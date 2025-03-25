export interface Project {
  name: string;
  description: string;
  image?: string;
  links: {
    url: string;
    label: string;
  }[];
  technologies?: string[];
} 