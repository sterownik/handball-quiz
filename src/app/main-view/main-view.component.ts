import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CustomQuestions,
  SingleQuestion,
  TypeGame,
} from '../defs/handball-web.defs';
import { QUESTIONS } from '../tokens/token';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
})
export class MainViewComponent implements OnInit {
  favouriteQuestions: SingleQuestion[];
  saveNumberCatalogQuestion: number;
  saveNumberChosenQuestion: number;

  allQuestionNumber: number;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    @Inject(QUESTIONS) private questionsInject: SingleQuestion[]
  ) {}

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
    this.allQuestionNumber =
      this.getUploadedQuestions() || this.questionsInject.length;
  }

  private getUploadedQuestions(): number | false {
    if (localStorage.getItem('customQuestions') === null) return false;

    const customQuestions: CustomQuestions = JSON.parse(
      localStorage.getItem('customQuestions') as string
    );
    if (customQuestions.defaultMode === 'custom')
      return customQuestions.file.questions.length;

    return false;
  }

  openGame(mode: TypeGame): void {
    this.router.navigate(['/game-view', { name: mode }]);
  }

  openExam(): void {
    this.router.navigate(['/examination']);
  }

  openUploadComponent(): void {
    this.router.navigate(['/upload-question']);
  }
}
