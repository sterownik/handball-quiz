import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-part',
  templateUrl: './question-part.component.html',
})
export class QuestionPartComponent {
  @Input() questionText = '';
}
