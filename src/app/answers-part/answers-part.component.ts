import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PreparedAnswer, Subanswer } from '../defs/handball-web.defs';

@Component({
  selector: 'app-answers-part',
  templateUrl: './answers-part.component.html',
})
export class AnswersPartComponent implements OnChanges {
  @Input() answers: Subanswer[];
  @Input() inputsFormGroup: FormGroup;
  @Input() showCorrectAnswers: boolean;

  answersShow: PreparedAnswer[] = [];

  prepareInputs(): void {
    for (let single of this.answers) {
      this.answersShow.push({
        id: single.orig_id,
        title: single.text,
        correctness: single.correctness,
      });
    }
    this.answersShow.map((item) => {
      this.inputsFormGroup.addControl(item.id, new FormControl(false));
    });
  }

  ngOnChanges(): void {
    this.answersShow = [];
    this.prepareInputs();
  }
}
