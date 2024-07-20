import { Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idQuestionTranslate',
})
export class IdQuestionTranslate implements PipeTransform {
  transform(value: string): string {
    return value.substring(1);
  }
}

@Component({
  selector: 'app-question-part',
  templateUrl: './question-part.component.html',
})
export class QuestionPartComponent {
  @Input() questionText = '';
  @Input() id = '';
}
