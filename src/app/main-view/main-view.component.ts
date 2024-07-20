import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CustomQuestions,
  NewQuestions,
  TypeGame,
} from '../defs/handball-web.defs';
import { QUESTIONS } from '../tokens/token';
import { SharedService } from '../common/shared.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
})
export class MainViewComponent implements OnInit {
  favouriteQuestions: NewQuestions;
  saveNumberCatalogQuestion: number;
  saveNumberChosenQuestion: number;

  allQuestionNumber: number;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    @Inject(QUESTIONS) private questionsInject: NewQuestions,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.favouriteQuestions = JSON.parse(
      localStorage.getItem('answersNew') as string
    );
    this.saveNumberCatalogQuestion = parseInt(
      localStorage.getItem('numberCatalogQuestion') ?? '-1'
    );

    this.saveNumberChosenQuestion = parseInt(
      localStorage.getItem('numberChosenQuestion') ?? '-1'
    );
    this.allQuestionNumber =
      this.getUploadedQuestions() || this.questionsInject.all_questions.length;
  }

  changeLanguage() {
    this.sharedService.language.next(
      this.sharedService.language.value === 'eng' ? 'pl' : 'eng'
    );
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

  get favouriteQuestionsExist() {
    return !!this.favouriteQuestions;
  }

  openExam(): void {
    this.router.navigate(['/examination']);
  }

  openUploadComponent(): void {
    this.router.navigate(['/upload-question']);
  }
}
