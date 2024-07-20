import { Component, OnInit } from '@angular/core';
import { SharedService } from './common/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'handball-web-app';

  constructor(private sharedService: SharedService) {}
  ngOnInit(): void {
    this.sharedService.getInitializedLanguage();
    this.sharedService.observeChangeLanguage();
  }
}
