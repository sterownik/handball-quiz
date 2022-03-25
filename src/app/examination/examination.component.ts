import { SingleQuestion } from './../defs/handball-web.defs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  delay,
  filter,
  merge,
  Observable,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { QUESTIONS } from '../tokens/token';
import { ToastService } from '../common/toast.service';
import { QuizCommonComponent } from '../common/quiz-common.component';
@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
})
export class ExaminationComponent
  extends QuizCommonComponent
  implements OnInit, OnDestroy
{
  orderNumberQuestion: number;

  counter: number;
  tick: number;

  validButton: boolean;

  private startCounter: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(QUESTIONS) questionsInject: SingleQuestion[],
    protected override toast: ToastService
  ) {
    super(toast);
    this.counter = 100;
    this.tick = 500;
    this.validButton = true;
    this.questions = this.getUploadedQuestions() || questionsInject;
    this.startCounter = true;
  }

  ngOnInit(): void {
    this.prepareQuestion();
    this.observableTimer().subscribe();
  }

  handlingCheckButton(): void {
    if (this.prepareToCheckButton()) return;
    this.inCaseValidAnswer();
  }

  private observableTimer(): Observable<number | boolean> {
    return merge(timer(0, this.tick), this.timerSubject$).pipe(
      tap((_) => {
        if (this.startCounter) --this.counter;
        if (this.counter === 0) {
          this.handlingCheckButton();
        }
      }),
      takeUntil(this.destory$),
      filter((value) => typeof value === 'boolean'),
      switchMap(() => this.nextQuestion())
    );
  }

  private nextQuestion(): Observable<number | boolean> {
    return of(1).pipe(
      take(1),
      tap((_) => {
        this.startCounter = false;
        this.validButton = false;
      }),
      delay(3000),
      tap((_) => {
        this.startCounter = true;
        this.counter = 100;
        this.goNextQuestion();
        this.validButton = true;
        this.passValidQuestions = [];
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

  private calcuateResult(): void {
    const result = parseFloat(((this.points / 40) * 100).toFixed(2));
    if (result >= 70) {
      this.toast.displayToast({
        text: `Zdałeś zdobywając ${result}%`,
        class: 'info-snackbar',
      });
    } else {
      this.toast.displayToast({
        text: `Niezdałeś zdobywając ${result}%`,
        class: 'alert-snackbar',
      });
    }
    const that = this;
    setTimeout(() => {
      that.router.navigate(['']);
    }, 5000);
    this.destory$.next(true);
  }

  private inCaseValidAnswer(): void {
    this.prepareInCaseValidAnswer();
    this.timerSubject$.next(true);
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
  }
}
