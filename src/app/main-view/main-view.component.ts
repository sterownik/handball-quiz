import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleQuestion, TypeGame } from '../defs/handball-web.defs';
import { GameViewComponent } from '../game-view/game-view.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
})
export class MainViewComponent implements OnInit {
  favouriteQuestions: SingleQuestion[];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.favouriteQuestions = JSON.parse(
      localStorage.getItem('answers') as string
    );
  }

  openGame(mode: TypeGame): void {
    this.router.navigate(['/game-view', { name: mode }]);
  }
}
