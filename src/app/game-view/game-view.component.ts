import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SingleQuestion,
  Counter,
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
export class GameViewComponent implements OnInit {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;
  allQuestionNumber: number;
  passValidQuestions: AnswerMarked[];
  gameMode: TypeGame;

  actualNumberQuestion: number;

  dataCounter: Counter;

  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
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

    if (this.questions.length === 0) {
      return;
    }

    this.prepareQuestion();
  }

  prepareQuestion(): void {
    this.actualNumberQuestion = 0;
    this.formGroup = this.fb.group({});

    this.actualQuestion = this.questions[this.actualNumberQuestion];
    this.allQuestionNumber = this.questions.length - 1;
    this.passValidQuestions = [];
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

  validNumberQuestion(numberQuestion: number): number {
    if (numberQuestion > this.allQuestionNumber) {
      return 0;
    }
    if (numberQuestion < 0) {
      return this.allQuestionNumber;
    }
    return numberQuestion;
  }

  drawNumberQuestion(): number {
    return Math.floor(Math.random() * (this.allQuestionNumber + 2) + 1);
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

  inCaseValidAnswer(): void {
    this._snackBar.open('Dobra odpowiedź', undefined, {
      duration: 3000,
      panelClass: 'info-snackbar',
    });
    this.passValidQuestions = [];
    return this.handlingButtons('up');
  }

  inCaseInValidAnswer() {
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

  parseAnswersToArray(value: any): AnswerMarked[] {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as AnswerMarked[];
  }

  popQuestion(): void {
    let array = this.getAndSaveArray();
    console.log(array);
    console.log(this.actualNumberQuestion);
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

  getAndSaveArray(): SingleQuestion[] {
    let array = [];
    let items = JSON.parse(localStorage.getItem('answers') as string) || [];
    array = items;
    return array;
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

  showInformation(text: string): void {
    this._snackBar.open(text, undefined, {
      duration: 3000,
      panelClass: 'warining-snackbar',
    });
  }
}
