import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { GameViewComponent } from '../game-view/game-view.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
})
export class MainViewComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openGame(): void {
    const dialogRef = this.dialog.open(GameViewComponent, {
      minHeight: '100vh',
      minWidth: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
