import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SingleQuestion,
  HandlingButtons,
  AnswerMarked,
  TypeGame,
} from '../defs/handball-web.defs';
import * as QuestionsJson from '../../assets/questions/questions.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent implements OnInit, OnDestroy {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;

  passValidQuestions: AnswerMarked[];
  gameMode: TypeGame;

  actualNumberQuestion: number;
  allQuestionNumber: number;
  points: number;

  formGroup: FormGroup;

  routerSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: ActivatedRoute
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.saveNumberOfQuestion();
  }

  ngOnInit(): void {
    this.routerSubscription = this.router.params.subscribe((params) => {
      this.gameMode = params['name'];
    });

    switch (this.gameMode) {
      case 'main':
        this.questions = QuestionsJson as SingleQuestion[];
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

  handlingButtons(type: HandlingButtons): void {
    switch (type) {
      case 'up':
        this.actualNumberQuestion++;
        break;
      case 'down':
        this.actualNumberQuestion--;
        break;
      case 'draw':
        this.actualNumberQuestion = this.drawNumberQuestion();
        break;
      default:
    }
    this.passValidQuestions = [];

    this.actualNumberQuestion = this.validNumberQuestion(
      this.actualNumberQuestion
    );
    this.actualQuestion = this.questions[this.actualNumberQuestion];
  }

  handlingCheckButton(): void {
    const parsingAnswers = this.parseAnswersToArray(this.formGroup.value);
    this.formGroup.reset();

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
    )
      return;
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
    return Math.floor(Math.random() * (this.allQuestionNumber + 2) + 1);
  }

  private inCaseValidAnswer(): void {
    this.points++;
    this._snackBar.open('Dobra odpowiedź', undefined, {
      duration: 3000,
      panelClass: 'info-snackbar',
    });
    this.passValidQuestions = [];
    return this.handlingButtons('up');
  }

  private inCaseInValidAnswer() {
    this._snackBar.open('Zła odpowiedź!', undefined, {
      duration: 3000,
      panelClass: 'alert-snackbar',
    });

    this.passValidQuestions = this.actualQuestion.correctAnswers;

    const that = this;
    setTimeout(() => {
      that.passValidQuestions = [];
    }, 5000);
  }

  private parseAnswersToArray(value: any): AnswerMarked[] {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as AnswerMarked[];
  }

  private showInformation(text: string): void {
    this._snackBar.open(text, undefined, {
      duration: 3000,
      panelClass: 'warining-snackbar',
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
    this.routerSubscription.unsubscribe();
    this.saveNumberOfQuestion();
  }
}
