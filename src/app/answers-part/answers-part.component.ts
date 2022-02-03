import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Answers, Odp } from '../game-view/game-view.component';

interface AnswersPrepare {
  id: Odp;
  title: string;
}

@Component({
  selector: 'app-answers-part',
  templateUrl: './answers-part.component.html',
})
export class AnswersPartComponent implements OnInit {
  @Input() answers: Answers = [];
  @Input() inputsFormGroup: FormGroup;

  answersShow: AnswersPrepare[] = [];

  ngOnInit(): void {
    this.prepareInputs();
  }

  prepareInputs(): void {
    for (let single in this.answers) {
      this.answersShow.push({
        id: single as Odp,
        title: this.answers[single as Odp],
      })
    }
    this.answersShow.map((item) => {
      this.inputsFormGroup.addControl(item.id, new FormControl(false))
    })
  }
}
