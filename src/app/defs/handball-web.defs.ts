export interface PreparedAnswer {
  id: AnswerMarked;
  title: string | undefined;
}

export type AnswerMarked = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

export type HandlingButtons = 'up' | 'down' | 'draw' | 'skipUp' | 'skipDown';

export type Answers = Partial<Record<AnswerMarked, string>>;

export interface SingleQuestion {
  question: string;
  answers: Answers;
  correctAnswers: AnswerMarked[];
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
