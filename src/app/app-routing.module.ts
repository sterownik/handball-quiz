import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminationComponent } from './examination/examination.component';
import { GameViewComponent } from './game-view/game-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { UploadQuestionsComponent } from './upload-questions/upload-questions.component';

const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'game-view', component: GameViewComponent },
  { path: 'examination', component: ExaminationComponent },
  { path: 'upload-question', component: UploadQuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
