export interface PreparedAnswer {
  id: string;
  title: string | undefined;
  correctness: number;
}

export type HandlingButtons = 'up' | 'down' | 'draw' | 'skipUp' | 'skipDown';

export type Answers = Partial<Record<string, string>>;

export interface NewQuestions {
  all_questions: AllQuestion[];
}

export interface AllQuestion {
  id: number;
  orig_id: string;
  text: string;
  rules: string;
  subanswers: Subanswer[];
}

export interface Subanswer {
  orig_id: string;
  text: string;
  correctness: number;
}

export interface TopBarInformation {
  actualNumber: number;
  allQuestionNumber: number;
  points: number;
}

export type TypeGame = 'main' | 'chosenAnswers';

export interface Toast {
  text: string;
  class: string;
  positionTop?: boolean;
  time?: number;
}

export type defaultMode = 'default' | 'custom';

export interface CustomQuestions {
  defaultMode: defaultMode;
  file: FileQuestion;
}

export interface FileQuestion {
  name: string;
  questions: NewQuestions[];
}

export type StateOfUpload = 'errorUpload' | 'badFormat' | FileQuestion;
