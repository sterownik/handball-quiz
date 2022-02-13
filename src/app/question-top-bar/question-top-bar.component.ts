import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TopBarInformation } from '../defs/handball-web.defs';

@Component({
  selector: 'app-question-top-bar',
  templateUrl: './question-top-bar.component.html',
})
export class QuestionTopBarComponent {
  @Input() topBarInformation: TopBarInformation;
  constructor(private router: Router) {}

  cancel() {
    this.router.navigate(['']);
  }
}
