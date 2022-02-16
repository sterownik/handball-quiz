import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Toast } from '../defs/handball-web.defs';

@Injectable()
export class ToastService {
  constructor(private _snackBar: MatSnackBar) {}

  displayToast(toastParams: Toast) {
    this._snackBar.open(toastParams.text, undefined, {
      duration: toastParams.time || 5000,
      panelClass: toastParams.class,
      verticalPosition: toastParams.positionTop ? 'top' : 'bottom',
    });
  }
}
