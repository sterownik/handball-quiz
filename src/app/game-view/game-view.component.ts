import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SingleQuestion, Counter } from '../defs/handball-web.defs';
import * as QuestionsJson from '../../assets/questions/questions.json'

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent {
  questions: SingleQuestion[];
  actualQuestion: SingleQuestion;

  actualNumberQuestion: number;

  dataCounter: Counter;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.actualNumberQuestion = 0;
    this.formGroup = fb.group({});
    this.questions = QuestionsJson as SingleQuestion[];

    this.actualQuestion = this.questions[this.actualNumberQuestion];
  }
}
