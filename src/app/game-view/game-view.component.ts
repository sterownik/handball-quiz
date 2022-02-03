import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export type Odp = 'A' & 'B' & 'C';
export type Answers = Record<Odp, string>;

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
})
export class GameViewComponent implements OnInit {
  textTest =
    "2.1 Bramkarz A1 broni rzut, piłka przekracza linię końcową boiska zaraz po automatycznym sygnale kończący grę. Sędziowie orientują się, że mecz zakończył się 5 minut za wcześnie. Zawodnicy wciąż pozostają na boisku. Jak należy wznowić grę?";

  answersRecord: Answers = {
    A: 'Rzut od bramki dla drużyny A',
    B: 'Rzut wolny dla drużyny A',
    C: 'Bez sygnału gwizdka',
    D: 'Po sygnale gwizdka',
  }

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = fb.group({});
  }

  ngOnInit(): void {}
}
