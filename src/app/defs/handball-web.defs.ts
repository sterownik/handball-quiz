
export interface PreparedAnswer {
  id: AnswerMarked;
  title: string | undefined;
}

export type AnswerMarked = 'A' | 'B' | 'C' | 'D' | 'E';

export type HandlingButtons = 'up' | 'down' | 'draw';

export type Answers = Partial<Record<AnswerMarked, string>>;

export interface SingleQuestion {
  question: string;
  answers: Answers;
  correctAnswers: AnswerMarked[];
}

export interface Counter{
  actualNumber: number,
  allQuestionNumber: number;
}