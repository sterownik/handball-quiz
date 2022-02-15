import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleQuestion, TypeGame } from '../defs/handball-web.defs';
import { GameViewComponent } from '../game-view/game-view.component';
import * as QuestionsJson from '../../assets/questions/questions.json';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
})
export class MainViewComponent implements OnInit {
  favouriteQuestions: SingleQuestion[];
  saveNumberCatalogQuestion: number;
  saveNumberChosenQuestion: number;

  allQuestionNumber: number;

  constructor(public dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.favouriteQuestions = JSON.parse(
      localStorage.getItem('answers') as string
    );
    this.saveNumberCatalogQuestion = parseInt(
      localStorage.getItem('numberCatalogQuestion') ?? '-1'
    );

    this.saveNumberChosenQuestion = parseInt(
      localStorage.getItem('numberChosenQuestion') ?? '-1'
    );
    const question: SingleQuestion[] = QuestionsJson as SingleQuestion[];
    this.allQuestionNumber = question.length;
  }

  openGame(mode: TypeGame): void {
    this.router.navigate(['/game-view', { name: mode }]);
  }

  openExam(): void {
    this.router.navigate(['/examination']);
  }
}
