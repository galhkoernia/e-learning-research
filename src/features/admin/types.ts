export type PublishStatus = "Published" | "Draft";
export type ParticipantStatus = "Not started" | "In progress" | "Completed";
export type BadgeStatus = PublishStatus | ParticipantStatus;

export type AssessmentType = "Pre-Test" | "Quiz 1" | "Quiz 2" | "Post-Test";
export type QuestionType = "Multiple choice" | "True/False";

export interface Participant {
  id: string;
  name: string;
  /** null until the participant has submitted the assessment. */
  preTest: number | null;
  postTest: number | null;
  /** 0-100, share of the learning flow completed. */
  progress: number;
  currentStep: string;
  status: ParticipantStatus;
}

export interface Material {
  id: string;
  number: number;
  title: string;
  description: string;
  hasVideo: boolean;
  quiz: AssessmentType;
  status: PublishStatus;
}

export interface Video {
  id: string;
  title: string;
  materialNumber: number;
  duration: string;
  status: PublishStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  type: QuestionType;
  assessment: AssessmentType;
  relatedMaterial: string;
  status: PublishStatus;
}

export interface ActivityItem {
  id: string;
  participantId: string;
  action: string;
  time: string;
}