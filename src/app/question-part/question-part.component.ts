import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-part',
  templateUrl: './question-part.component.html',
})
export class QuestionPartComponent implements OnInit {
  @Input() questionText = '';

  constructor() { }

  ngOnInit(): void {
  }

}
