import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameViewComponent } from './game-view/game-view.component';
import { MainViewComponent } from './main-view/main-view.component';

const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'game-view', component: GameViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
