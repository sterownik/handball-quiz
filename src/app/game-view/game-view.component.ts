import { CustomQuestions } from './../defs/handball-web.defs';
import { Subscription, takeUntil, filter, delay } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  SingleQuestion,
  HandlingButtons,
  TypeGame,
} from '../defs/handball-web.defs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { QUESTIONS } from '../tokens/token';
import { ToastService } from '../common/toast.service';
import { QuizCommonComponent } from '../common/quiz-common.component';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent
  extends QuizCommonComponent
  implements OnInit, OnDestroy
{
  gameMode: TypeGame;

  routerSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    @Inject(QUESTIONS) private questionsInject: SingleQuestion[],
    protected override toast: ToastService
  ) {
    super(toast);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.saveNumberOfQuestion();
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.params.subscribe((params) => {
      this.gameMode = params['name'];
    });

    this.timerSubject$
      .pipe(
        filter((value) => value),
        delay(5000),
        takeUntil(this.destory$)
      )
      .subscribe(() => (this.passValidQuestions = []));

    switch (this.gameMode) {
      case 'main':
        this.questions = this.getUploadedQuestions() || this.questionsInject;
        break;
      case 'chosenAnswers':
        this.questions = JSON.parse(localStorage.getItem('answers') as string);
        break;
    }

    if (!this.questions || this.questions.length === 0) {
      return;
    }

    this.prepareQuestion();
  }

  private getUploadedQuestions(): SingleQuestion[] | false {
    if (localStorage.getItem('customQuestions') === null) return false;

    const customQuestions: CustomQuestions = JSON.parse(
      localStorage.getItem('customQuestions') as string
    );
    if (customQuestions.defaultMode === 'custom')
      return customQuestions.file.questions;

    return false;
  }

  handlingButtons(type: HandlingButtons): void {
    switch (type) {
      case 'up':
        this.actualNumberQuestion++;
        break;
      case 'down':
        this.actualNumberQuestion--;
        break;
      case 'skipDown':
        this.actualNumberQuestion -= 50;
        break;
      case 'skipUp':
        this.actualNumberQuestion += 50;
        break;
      case 'draw':
        this.actualNumberQuestion = this.drawNumberQuestion();
        break;
      default:
    }
    this.passValidQuestions = [];
    this.formGroup.reset();

    this.actualNumberQuestion = this.validNumberQuestion(
      this.actualNumberQuestion
    );
    this.actualQuestion = this.questions[this.actualNumberQuestion];
  }

  handlingCheckButton(): void {
    if (this.prepareToCheckButton()) return;
    this.inCaseValidAnswer();
  }

  popQuestion(): void {
    let array = this.getAndSaveArray();
    const index = array.findIndex((question: SingleQuestion) =>
      question.question.match(this.actualQuestion.question)
    );
    array.splice(index, 1);
    localStorage.setItem('answers', JSON.stringify(array));
    this.questions = array;
    if (this.actualNumberQuestion >= array.length) {
      this.actualNumberQuestion--;
    }
    this.allQuestionNumber = array.length - 1;

    this.actualQuestion = array[this.actualNumberQuestion];
    this.showInformation('Usunąłeś pytanie');
    this.passValidQuestions = [];
  }

  pushQuestion(): void {
    let array = this.getAndSaveArray();
    if (
      array.some((question: SingleQuestion) =>
        question.question.match(this.actualQuestion.question)
      )
    ) {
      this.toast.displayToast({
        text: 'To pytanie zostało już dodane!',
        class: 'alert-snackbar',
        time: 3000,
        positionTop: true,
      });
      return;
    }
    array.push(this.actualQuestion);
    localStorage.setItem('answers', JSON.stringify(array));
    this.showInformation('Dodałeś pytanie!');
  }

  private prepareQuestion(): void {
    this.points = 0;
    this.actualNumberQuestion = this.getNumberOfQuestion();
    this.formGroup = this.fb.group({});

    this.actualQuestion = this.questions[this.actualNumberQuestion];
    this.allQuestionNumber = this.questions.length - 1;
    this.passValidQuestions = [];
  }

  private inCaseValidAnswer(): void {
    this.prepareInCaseValidAnswer();
    return this.handlingButtons('up');
  }

  private showInformation(text: string): void {
    this.toast.displayToast({
      text: text,
      class: 'warining-snackbar',
      time: 3000,
      positionTop: true,
    });
  }

  private getAndSaveArray(): SingleQuestion[] {
    let array = [];
    let items = JSON.parse(localStorage.getItem('answers') as string) || [];
    array = items;
    return array;
  }

  private saveNumberOfQuestion(): void {
    if (!this.questions || this.questions.length === 0) {
      localStorage.setItem('numberChosenQuestion', '0');
      return;
    }

    if (this.gameMode === 'main') {
      localStorage.setItem(
        'numberCatalogQuestion',
        this.actualNumberQuestion + ''
      );
      return;
    }

    localStorage.setItem(
      'numberChosenQuestion',
      this.actualNumberQuestion + ''
    );
  }

  private getNumberOfQuestion(): number {
    if (this.gameMode === 'main') {
      return parseInt(localStorage.getItem('numberCatalogQuestion') ?? '0', 10);
    }

    return parseInt(localStorage.getItem('numberChosenQuestion') ?? '0', 10);
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.routerSubscription.unsubscribe();
    this.saveNumberOfQuestion();
  }
}
