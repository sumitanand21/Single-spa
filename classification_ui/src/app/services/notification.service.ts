import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showToastrSuccess(headText, msg) {
    this.toastr.success(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }

  // Info
  showToastrInfo(headText, msg) {
    this.toastr.info(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }
  // Warning
  showToastrWarning(headText, msg) {
    this.toastr.warning(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }
   // Error
   showToastrError(headText, msg) {
    this.toastr.error(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }
}
