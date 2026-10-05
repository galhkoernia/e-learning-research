export interface LearningMaterial {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface LearningCourse {
  title: string;
  category: string;
  level: string;
  description: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface LearningStep {
  number: string;
  title: string;
  description: string;
}

export interface LearningData {
  course: LearningCourse;
  materials: LearningMaterial[];
  benefits: Benefit[];
  process: LearningStep[];
}