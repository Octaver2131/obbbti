export interface Question {
  id: number;
  text: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP' | 'AT';
  leftLabel: string;
  rightLabel: string;
  influences?: Influence[];
}

export interface Influence {
  dimension: 'EI' | 'SN' | 'TF' | 'JP' | 'AT';
  leftEffect: number;
  rightEffect: number;
}

export interface AnswerRecord {
  questionId: number;
  value: number;
  dimension: string;
}

export interface DimensionScore {
  label: string;
  percentage: number;
}

export interface PersonalityResult {
  type: string;
  name: string;
  description: string;
  dimensions: {
    EI: DimensionScore;
    SN: DimensionScore;
    TF: DimensionScore;
    JP: DimensionScore;
    AT: DimensionScore;
  };
}

export type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
  Result: { answers: AnswerRecord[] };
  ResultView: { result: PersonalityResult };
  Personalities: undefined;
};
