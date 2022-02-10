import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SingleQuestion,
  Counter,
  HandlingButtons,
  AnswerMarked,
} from '../defs/handball-web.defs';
import * as QuestionsJson from '../../assets/questions/questions.json';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;
  allQuestionNumber: number;
  passValidQuestions: AnswerMarked[];

  actualNumberQuestion: number;

  dataCounter: Counter;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.actualNumberQuestion = 0;
    this.formGroup = fb.group({});
    this.questions = QuestionsJson as SingleQuestion[];

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
      this._snackBar.open('Dobra odpowiedź', undefined, {
        duration: 3000,
        panelClass: 'info-snackbar',
      });
      this.passValidQuestions = [];
      return this.handlingButtons('up');
    }

    this._snackBar.open('Zła odpowiedź!', undefined, {
      duration: 3000,
      panelClass: 'alert-snackbar',
    });

    this.passValidQuestions = this.actualQuestion.correctAnswers;
  }

  parseAnswersToArray(value: any): AnswerMarked[] {
    const keys = Object.keys(value);
    return keys.filter((key) => value[key]) as AnswerMarked[];
  }
}
