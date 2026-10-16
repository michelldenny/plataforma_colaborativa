
export type PosturaType = string;

export type ContentType = string;

export interface Post {
  id: string;
  postura: PosturaType;
  subprefeitura: string; // ID da subprefeitura
  title: string;
  content: string;
  address?: string;
  author?: string;
  type: ContentType;
  createdAt: number;
  fileName?: string;
  fileUrl?: string;
}

export interface Subprefeitura {
  id: string;
  name: string;
  region: 'Centro' | 'Norte' | 'Sul' | 'Leste' | 'Oeste';
}

export interface ContentTypeItem {
  value: string;
  label: string;
  color: string;
  iconBg: string;
  iconText: string;
  isCustom?: boolean;
}

export interface PosturaItem {
  name: string;
  isCustom?: boolean;
  colorTheme?: string;
}

export interface TaxonomiesState {
  posturas: string[];
  contentTypes: ContentTypeItem[];
}