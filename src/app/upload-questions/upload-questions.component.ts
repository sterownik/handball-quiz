import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../common/toast.service';
import { CustomQuestions, StateOfUpload } from '../defs/handball-web.defs';
import { UploadQuestionsService } from './upload-questions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-questions',
  templateUrl: './upload-questions.component.html',
})
export class UploadQuestionsComponent implements OnInit {
  form: FormGroup;
  customQuestions: CustomQuestions;

  constructor(
    private toast: ToastService,
    private fb: FormBuilder,
    private uploadQuestionsService: UploadQuestionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customQuestions = localStorage.getItem('customQuestions')
      ? JSON.parse(localStorage.getItem('customQuestions') as string)
      : null;

    this.form = this.fb.group({
      questions: [this.customQuestions?.defaultMode || 'default'],
    });
  }

  onSubmit(): void {
    localStorage.setItem(
      'customQuestions',
      JSON.stringify({
        defaultMode: this.form.value.questions,
        file: this.customQuestions.file,
      })
    );
    this.clearQuestions();
    this.router.navigate(['']);
  }

  private clearQuestions(): void {
    localStorage.removeItem('answers');
    localStorage.removeItem('numberCatalogQuestion');
    localStorage.removeItem('numberChosenQuestion');
  }

  jsonInputChange(fileInputEvent: any) {
    this.uploadQuestionsService
      .checkValidUploadedQuestions(fileInputEvent.target.files[0])
      .subscribe((state: StateOfUpload) => {
        this.validUploadedFile(state);
      });
  }

  private validUploadedFile(state: StateOfUpload): void {
    switch (state) {
      case 'errorUpload':
        this.toast.displayToast({
          text: 'Błąd podczas uploadu, sprawdz format pliku',
          class: 'alert-snackbar',
        });
        break;
      case 'badFormat':
        this.toast.displayToast({
          text: 'Popraw plik! Nie ma w nim wszytskich potrzebnych danych do wyświetlania pytań',
          class: 'alert-snackbar',
        });
        break;
      default:
        this.toast.displayToast({
          text: 'Pytania wgrane poprawnie',
          class: 'info-snackbar',
        });
        this.customQuestions = {
          defaultMode: 'default',
          file: {
            name: state.name,
            questions: state.questions,
          },
        };
    }
  }
}
