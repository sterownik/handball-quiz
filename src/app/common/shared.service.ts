import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';

export type Language = 'pl' | 'eng';

@Injectable({ providedIn: 'root' })
export class SharedService {
  language = new BehaviorSubject<Language>('pl');
  isPl$ = this.language.pipe(map((value) => value === 'pl'));

  getInitializedLanguage() {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved) {
      this.language.next(saved);
    } else {
      localStorage.setItem('language', 'pl');
      this.language.next('pl');
    }
  }

  observeChangeLanguage() {
    this.language.subscribe((value) => {
      localStorage.setItem('language', value);
    });
  }
}
