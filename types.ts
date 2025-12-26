
export enum WorkoutType {
  FITNESS = 'Fitness',
  CROSSFIT = 'Crossfit',
  CARDIO = 'Cardio'
}

export type FitnessSubType = 'Empuje' | 'Tirón' | 'Pierna' | 'Full Body' | 'Core' | 'Personalizado';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_group: string;
  is_custom?: boolean;
}

export interface Set {
  id?: string;
  // Fitness & Crossfit
  weight?: number;
  reps?: number;
  rpe?: number;
  is_failure?: boolean;
  // Cardio
  distance?: number;
  time_seconds?: number;
  avg_heart_rate?: number;
}

export interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise: Exercise;
  sets: Set[];
}

export interface Workout {
  id: string;
  date: string;
  type: WorkoutType;
  sub_type: string;
  duration: number;
  notes: string;
  exercises: WorkoutExercise[];
}

export interface BodyMetrics {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  body_fat_perc: number;
  muscle_perc: number;
  bone_perc: number;
  photo_url?: string;
  ai_analysis_summary?: string;
}
