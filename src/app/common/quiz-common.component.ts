import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  AnswerMarked,
  CustomQuestions,
  SingleQuestion,
} from '../defs/handball-web.defs';
import { ToastService } from './toast.service';

@Directive({
  selector: 'QuizCommon',
})
export class QuizCommonComponent {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;
  passValidQuestions: AnswerMarked[];
  actualNumberQuestion: number;
  allQuestionNumber: number;
  points: number;
  formGroup: FormGroup;
  protected timerSubject$ = new Subject<boolean>();
  protected destory$ = new Subject<boolean>();

  constructor(protected toast: ToastService) {}

  protected validNumberQuestion(numberQuestion: number): number {
    if (numberQuestion > this.allQuestionNumber) {
      return 0;
    }
    if (numberQuestion < 0) {
      return this.allQuestionNumber;
    }
    return numberQuestion;
  }

  protected getUploadedQuestions(): SingleQuestion[] | false {
    if (localStorage.getItem('customQuestions') === null) return false;

    const customQuestions: CustomQuestions = JSON.parse(
      localStorage.getItem('customQuestions') as string
    );
    if (customQuestions.defaultMode === 'custom')
      return customQuestions.file.questions;

    return false;
  }

  protected drawNumberQuestion(): number {
    return Math.floor(Math.random() * (this.allQuestionNumber + 1));
  }

  protected parseAnswersToArray(value: any): AnswerMarked[] {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as AnswerMarked[];
  }

  protected inCaseInValidAnswer() {
    this.toast.displayToast({
      text: 'Zła odpowiedź!',
      class: 'alert-snackbar',
      time: 3000,
      positionTop: true,
    });

    this.passValidQuestions = this.actualQuestion.correctAnswers;
    this.timerSubject$.next(true);
  }

  protected prepareToCheckButton(): boolean {
    const parsingAnswers = this.parseAnswersToArray(this.formGroup.value);

    if (
      JSON.stringify(parsingAnswers) !==
      JSON.stringify(
        this.actualQuestion.correctAnswers.map((single) =>
          single.toLocaleUpperCase()
        )
      )
    ) {
      this.inCaseInValidAnswer();
      return true;
    }

    return false;
  }

  protected prepareInCaseValidAnswer() {
    this.points++;

    this.toast.displayToast({
      text: 'Dobra odpowiedź',
      class: 'info-snackbar',
      time: 1800,
      positionTop: true,
    });

    this.passValidQuestions = [];
  }
}
