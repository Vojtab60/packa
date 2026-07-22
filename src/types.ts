import type { LucideIcon } from 'lucide-react';

export type Tone = 'green' | 'orange' | 'cream' | 'blue' | 'red' | 'mint';

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export type DogProfile = {
  name: string;
  breed: string;
  birthday: string;
  age: string;
  weight: string;
  chip: string;
  tattoo: string;
  vet: string;
  contacts: string[];
  notes: string;
};

export type Notification = {
  id: number;
  category: string;
  title: string;
  time: string;
  tone: Tone;
};

export type CardLink = {
  title: string;
  subtitle: string;
  path: string;
  icon: LucideIcon;
  tone?: Tone;
  metric?: string;
};

export type TrainingCommand = {
  slug: string;
  name: string;
  difficulty: string;
  age: string;
  tools: string[];
  duration: string;
  explanation: string;
  steps: string[];
  mistakes: string[];
  tips: string[];
};

export type Breed = {
  slug: string;
  name: string;
  size: string;
  energy: number;
  tags: string[];
  description: string;
  care: string;
  coat: string;
  temperament: string;
  suitableFor: string;
  activity: string;
  watchFor: string;
  imageApi: string;
};
