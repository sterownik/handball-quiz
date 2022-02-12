import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Counter } from '../defs/handball-web.defs';

@Component({
  selector: 'app-question-counter',
  templateUrl: './question-counter.component.html',
})
export class QuestionCounterComponent {
  @Input() counter: Counter;
  constructor(private router: Router) {}

  cancel() {
    this.router.navigate(['']);
  }
}
