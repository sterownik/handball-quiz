import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  AnswerMarked,
  Answers,
  PreparedAnswer,
} from '../defs/handball-web.defs';

@Component({
  selector: 'app-answers-part',
  templateUrl: './answers-part.component.html',
})
export class AnswersPartComponent implements OnChanges {
  @Input() answers: Answers;
  @Input() inputsFormGroup: FormGroup;
  @Input() validAnswers: AnswerMarked[];

  answersShow: PreparedAnswer[] = [];

  prepareInputs(): void {
    for (let single in this.answers) {
      this.answersShow.push({
        id: single as AnswerMarked,
        title: this.answers[single as AnswerMarked],
      });
    }
    this.answersShow.map((item) => {
      this.inputsFormGroup.addControl(item.id, new FormControl(false));
    });
  }

  ngOnChanges(): void {
    this.answersShow = [];
    this.validAnswers = this.validAnswers.map(
      (item) => item.toLocaleUpperCase() as AnswerMarked
    );
    this.prepareInputs();
  }
}
