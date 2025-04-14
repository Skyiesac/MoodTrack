export interface SelectUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MoodEntry {
  id: number;
  userId: number;
  date: Date;
  mood: number;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
