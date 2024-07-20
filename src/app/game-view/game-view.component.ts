import { AllQuestion, NewQuestions } from './../defs/handball-web.defs';
import { Subscription, takeUntil, filter, delay, tap, take } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Inject,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HandlingButtons, TypeGame } from '../defs/handball-web.defs';
import { ActivatedRoute } from '@angular/router';
import { QUESTIONS, QUESTIONS_ENG } from '../tokens/token';
import { ToastService } from '../common/toast.service';
import { QuizCommonComponent } from '../common/quiz-common.component';
import { SharedService } from '../common/shared.service';

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
    @Inject(QUESTIONS) private questionsInject: NewQuestions,
    protected override toast: ToastService,
    public sharedService: SharedService,
    @Inject(QUESTIONS_ENG) private questionsEngInject: NewQuestions
  ) {
    super(toast, sharedService);
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
      .subscribe(() => {
        this.showCorrectAnswers = false;
      });

    this.sharedService.isPl$
      .pipe(
        tap((value) => {
          switch (this.gameMode) {
            case 'main':
              if (value) {
                this.questions = this.questionsInject;
              } else {
                this.questions = this.questionsEngInject;
              }
              break;
            case 'chosenAnswers':
              this.questions = JSON.parse(
                localStorage.getItem('answersNew') as string
              );
              break;
          }
        })
      )
      .subscribe(() => {
        this.prepareQuestion();
      });

    if (!this.questions || this.questions?.all_questions.length === 0) {
      return;
    }
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
    this.formGroup.reset();

    this.actualNumberQuestion = this.validNumberQuestion(
      this.actualNumberQuestion
    );
    this.actualQuestion =
      this.questions.all_questions[this.actualNumberQuestion];
  }

  handlingCheckButton(): void {
    if (this.prepareToCheckButton()) return;
    this.inCaseValidAnswer();
  }

  popQuestion(): void {
    let array = this.getAndSaveArray();
    const index = array.all_questions.findIndex((question: AllQuestion) =>
      question.text.match(this.actualQuestion.text)
    );
    array.all_questions.splice(index, 1);
    localStorage.setItem('answersNew', JSON.stringify(array));
    this.questions = array;
    if (this.actualNumberQuestion >= array.all_questions.length) {
      this.actualNumberQuestion--;
    }
    this.allQuestionNumber = array.all_questions.length - 1;

    this.actualQuestion = array.all_questions[this.actualNumberQuestion];
    this.sharedService.isPl$.pipe(take(1)).subscribe((value) => {
      this.showInformation(
        value ? 'Usunąłeś pytanie!' : 'You delete question!'
      );
    });
    this.showCorrectAnswers = false;
  }

  pushQuestion(): void {
    let array = this.getAndSaveArray();
    if (
      array.all_questions.some((question: AllQuestion) =>
        question.text.match(this.actualQuestion.text)
      )
    ) {
      this.sharedService.isPl$.pipe(take(1)).subscribe((value) => {
        const text = value
          ? 'To pytanie zostało już dodane!'
          : 'You already added this question';

        this.toast.displayToast({
          text: text,
          class: 'alert-snackbar',
          time: 3000,
          positionTop: true,
        });
      });
      return;
    }
    this.sharedService.isPl$.pipe(take(1)).subscribe((value) => {
      array.all_questions.push(this.actualQuestion);
      localStorage.setItem('answersNew', JSON.stringify(array));
      this.showInformation(value ? 'Dodałeś pytanie!' : 'You add question!');
    });
  }

  private prepareQuestion(): void {
    this.points = 0;
    this.actualNumberQuestion = this.getNumberOfQuestion();
    this.formGroup = this.fb.group({});

    this.actualQuestion =
      this.questions.all_questions[this.actualNumberQuestion];
    this.allQuestionNumber = this.questions.all_questions.length - 1;
    // this.passValidQuestions = [];
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

  private getAndSaveArray(): NewQuestions {
    let array = [];
    let items = JSON.parse(localStorage.getItem('answersNew') as string) || {
      all_questions: [],
    };
    array = items;
    return array;
  }

  private saveNumberOfQuestion(): void {
    if (!this.questions || this.questions.all_questions.length === 0) {
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
