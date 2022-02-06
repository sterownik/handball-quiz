import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../defs/handball-web.defs';

@Component({
  selector: 'app-question-counter',
  templateUrl: './question-counter.component.html',
})
export class QuestionCounterComponent implements OnInit {
  @Input() counter: Counter;
  constructor() {}

  ngOnInit(): void {}
}
