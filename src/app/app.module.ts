import { MatSliderModule } from '@angular/material/slider';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './main-view/main-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameViewComponent } from './game-view/game-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QuestionPartComponent } from './question-part/question-part.component';
import { AnswersPartComponent } from './answers-part/answers-part.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FunctionalButtonsComponent } from './functional-buttons/functional-buttons.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExaminationComponent } from './examination/examination.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuestionTopBarComponent } from './question-top-bar/question-top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    GameViewComponent,
    QuestionPartComponent,
    AnswersPartComponent,
    FunctionalButtonsComponent,
    QuestionTopBarComponent,
    ExaminationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
