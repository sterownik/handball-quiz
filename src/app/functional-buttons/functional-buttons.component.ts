import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HandlingButtons } from '../defs/handball-web.defs';

@Component({
  selector: 'app-functional-buttons',
  templateUrl: './functional-buttons.component.html',
})
export class FunctionalButtonsComponent implements OnInit {
  @Output() handlingButtons = new EventEmitter<HandlingButtons>();
  constructor() {}

  ngOnInit(): void {}

  handlingButtonsEmmiter(type: HandlingButtons): void {
    this.handlingButtons.emit(type);
  }
}
