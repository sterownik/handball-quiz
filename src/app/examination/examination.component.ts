import { AnswerMarked, SingleQuestion } from './../defs/handball-web.defs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as QuestionsJson from '../../assets/questions/questions.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription, tap, timer } from 'rxjs';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
})
export class ExaminationComponent implements OnInit, OnDestroy {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;

  passValidQuestions: AnswerMarked[];

  actualNumberQuestion: number;
  allQuestionNumber: number;
  orderNumberQuestion: number;
  private delayTimer: number;
  points: number;
  counter: number;
  tick: number;

  validButton: boolean;

  formGroup: FormGroup;

  private countDownObservable: Observable<number>;

  private countDownSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.counter = 100;
    this.tick = 500;
    this.validButton = true;
  }

  ngOnInit(): void {
    this.questions = QuestionsJson as SingleQuestion[];
    this.prepareQuestion();

    this.countDownObservable = this.observableTimer();
    this.countDownSubscription = this.countDownObservable.subscribe();
  }

  handlingCheckButton(): void {
    const parsingAnswers = this.parseAnswersToArray(this.formGroup.value);

    if (
      JSON.stringify(parsingAnswers) ===
      JSON.stringify(
        this.actualQuestion.correctAnswers.map((single) =>
          single.toLocaleUpperCase()
        )
      )
    ) {
      return this.inCaseValidAnswer();
    }
    this.inCaseInValidAnswer();
  }

  private observableTimer(): Observable<number> {
    return timer(0, this.tick).pipe(
      tap(() => {
        --this.counter;

        if (this.counter === 0) {
          this.handlingCheckButton();

          const that = this;
          setTimeout(() => {
            that.counter = 100;
          }, this.delayTimer);
        }
      })
    );
  }

  private prepareQuestion(): void {
    this.points = 0;
    this.orderNumberQuestion = 1;
    this.allQuestionNumber = this.questions.length - 1;
    this.actualNumberQuestion = this.drawNumberQuestion();
    this.formGroup = this.fb.group({});

    this.actualQuestion = this.questions[this.actualNumberQuestion];
    this.passValidQuestions = [];
  }

  private goNextQuestion(): void {
    if (this.orderNumberQuestion === 40) {
      return this.calcuateResult();
    }
    this.formGroup.reset();
    this.orderNumberQuestion++;
    this.actualNumberQuestion = this.drawNumberQuestion();
    this.passValidQuestions = [];

    this.actualNumberQuestion = this.validNumberQuestion(
      this.actualNumberQuestion
    );
    this.actualQuestion = this.questions[this.actualNumberQuestion];
  }

  private validNumberQuestion(numberQuestion: number): number {
    if (numberQuestion > this.allQuestionNumber) {
      return 0;
    }
    if (numberQuestion < 0) {
      return this.allQuestionNumber;
    }
    return numberQuestion;
  }

  private drawNumberQuestion(): number {
    return Math.floor(Math.random() * (this.allQuestionNumber + 1));
  }

  private calcuateResult(): void {
    const result = parseFloat(((this.points / 40) * 100).toFixed(2));
    this.countDownSubscription.unsubscribe();
    if (result >= 70) {
      this._snackBar.open(`Zdałeś zdobywając ${result}%`, undefined, {
        duration: 5000,
        panelClass: 'info-snackbar',
      });
    } else {
      this._snackBar.open(`Niezdałeś zdobywając ${result}%`, undefined, {
        duration: 5000,
        panelClass: 'alert-snackbar',
      });
    }

    const that = this;
    setTimeout(() => {
      that.router.navigate(['']);
    }, 5000);
  }

  private inCaseValidAnswer(): void {
    this.points++;

    this._snackBar.open('Dobra odpowiedź', undefined, {
      duration: 1800,
      panelClass: 'info-snackbar',
    });

    this.passValidQuestions = [];
    this.delayTimer = 2000;
    this.timer(this.delayTimer);
  }

  private inCaseInValidAnswer() {
    this._snackBar.open('Zła odpowiedź!', undefined, {
      duration: 2500,
      panelClass: 'alert-snackbar',
    });

    this.passValidQuestions = this.actualQuestion.correctAnswers;
    this.delayTimer = 3000;
    this.timer(this.delayTimer);
  }

  private timer(timer: number): void {
    let that = this;
    this.validButton = false;

    this.countDownSubscription.unsubscribe();

    setTimeout(() => {
      this.countDownSubscription = this.countDownObservable.subscribe();
      that.counter = 100;
      that.goNextQuestion();
      this.validButton = true;
      that.passValidQuestions = [];
    }, timer);
  }

  private parseAnswersToArray(value: any): AnswerMarked[] {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as AnswerMarked[];
  }

  ngOnDestroy(): void {
    this.countDownSubscription.unsubscribe();
  }
}
