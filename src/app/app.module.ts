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

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    GameViewComponent,
    QuestionPartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
