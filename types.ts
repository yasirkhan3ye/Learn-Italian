
export interface WordItem {
  italian: string;
  english: string;
  urdu: string;
}

export interface VocabularyPack {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  icon: string;
  items: WordItem[];
}

export interface ConversationPack {
  title: string;
  subtitle: string;
  imageUrl: string;
  icon: string;
}

export enum NavItem {
  HOME = 'HOME',
  LESSONS = 'LESSONS',
  PROFILE = 'PROFILE'
}
