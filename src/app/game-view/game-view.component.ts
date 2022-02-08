import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SingleQuestion, Counter, HandlingButtons } from '../defs/handball-web.defs';
import * as QuestionsJson from '../../assets/questions/questions.json';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;
  allQuestionNumber: number;

  actualNumberQuestion: number;

  dataCounter: Counter;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.actualNumberQuestion = 0;
    this.formGroup = fb.group({});
    this.questions = QuestionsJson as SingleQuestion[];

    this.actualQuestion = this.questions[this.actualNumberQuestion];
    this.allQuestionNumber = this.questions.length - 1;
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

    this.actualNumberQuestion = this.validNumberQuestion(this.actualNumberQuestion);
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
    return Math.floor(Math.random() * this.allQuestionNumber) + 0;
  }
}
