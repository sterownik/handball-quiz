import { SingleQuestion, StateOfUpload } from './../defs/handball-web.defs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UploadQuestionsService {
  validFlag: boolean;

  checkValidUploadedQuestions(uploadedFile: File): Observable<StateOfUpload> {
    let that = this;
    return new Observable((observer: any) => {
      const fileReader = new FileReader();
      fileReader.readAsText(uploadedFile, 'UTF-8');
      fileReader.addEventListener('loadend', function () {
        if (!that.isJsonString(fileReader.result as string)) {
          observer.next('errorUpload');
          observer.complete();
        }

        const questions = JSON.parse(
          fileReader.result as string
        ) as SingleQuestion[];

        if (!that.checkValidationOfQustions(questions)) {
          observer.next('badFormat');
          observer.complete();
        }

        observer.next({
          name: uploadedFile.name,
          questions: questions,
        });
        observer.complete();
      });
      fileReader.addEventListener('error', () => {
        observer.next('errorUpload');
        observer.complete();
      });
    });
  }

  private checkValidationOfQustions(questions: SingleQuestion[]): boolean {
    return questions.every((question) => {
      return (
        this.checkIfQuestionExist(question) &&
        this.checkIfAnwersExist(question) &&
        this.checkIfCorrectAnswersEsist(question)
      );
    });
  }

  private checkIfCorrectAnswersEsist(question: SingleQuestion): boolean {
    return (
      'correctAnswers' in question &&
      typeof question?.correctAnswers === 'object' &&
      question?.correctAnswers.every((answer) => this.checkIfValidKey(answer))
    );
  }

  private checkIfAnwersExist(question: SingleQuestion): boolean {
    return (
      'answers' in question &&
      typeof question?.answers === 'object' &&
      Object.keys(question?.answers).every((key) => this.checkIfValidKey(key))
    );
  }

  private checkIfQuestionExist(question: SingleQuestion): boolean {
    return 'question' in question && typeof question?.question === 'string';
  }

  private checkIfValidKey(key: unknown): boolean {
    return (
      key === 'A' ||
      key === 'B' ||
      key === 'C' ||
      key === 'D' ||
      key === 'E' ||
      key === 'F' ||
      key === 'G' ||
      key === 'H' ||
      key === 'I' ||
      key === 'J'
    );
  }

  private isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
