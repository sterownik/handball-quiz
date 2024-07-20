import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, take } from 'rxjs';
import { AllQuestion, NewQuestions } from '../defs/handball-web.defs';
import { ToastService } from './toast.service';
import { SharedService } from './shared.service';

@Directive({
  selector: 'QuizCommon',
})
export class QuizCommonComponent {
  questions: NewQuestions;
  actualQuestion: AllQuestion;
  showCorrectAnswers!: boolean;
  actualNumberQuestion: number;
  allQuestionNumber: number;
  points: number;
  formGroup: FormGroup;
  protected timerSubject$ = new Subject<boolean>();
  protected destory$ = new Subject<boolean>();

  constructor(
    protected toast: ToastService,
    private sharedServices: SharedService
  ) {}

  protected validNumberQuestion(numberQuestion: number): number {
    if (numberQuestion > this.allQuestionNumber) {
      return 0;
    }
    if (numberQuestion < 0) {
      return this.allQuestionNumber;
    }
    return numberQuestion;
  }

  protected drawNumberQuestion(): number {
    return Math.floor(Math.random() * (this.allQuestionNumber + 1));
  }

  // TODO
  protected parseAnswersToArray(value: Record<string, boolean>): string {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as any;
  }

  protected inCaseInValidAnswer() {
    this.sharedServices.isPl$.pipe(take(1)).subscribe((value) => {
      this.toast.displayToast({
        text: value ? 'Zła odpowiedź!' : 'Wrong answer!',
        class: 'alert-snackbar',
        time: 3000,
        positionTop: true,
      });
    });

    this.showCorrectAnswers = true;
    this.timerSubject$.next(true);
  }

  protected prepareToCheckButton(): boolean {
    const parsingAnswers = this.parseAnswersToArray(this.formGroup.value);
    const parseCorrectAnswers = this.actualQuestion.subanswers
      .filter((value) => value.correctness === 1)
      .map((value) => value.orig_id);

    if (
      JSON.stringify(parseCorrectAnswers) !== JSON.stringify(parsingAnswers)
    ) {
      this.inCaseInValidAnswer();
      return true;
    }

    return false;
  }

  protected prepareInCaseValidAnswer() {
    this.points++;
    this.sharedServices.isPl$.pipe(take(1)).subscribe((value) => {
      this.toast.displayToast({
        text: value ? 'Dobra odpowiedź' : 'Correct answer!',
        class: 'info-snackbar',
        time: 1800,
        positionTop: true,
      });
    });

    this.showCorrectAnswers = false;
  }
}
