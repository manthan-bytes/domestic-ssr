import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThankyouPopUpComponent } from './thankyou-popup/thankyou-popup.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-new-user-popup',
  templateUrl: './new-user-popup.component.html',
  styleUrls: ['./new-user-popup.component.scss'],
})
export class NewUserPopupComponent {
  email: string = null;
  constructor(public activeModal: NgbActiveModal, private cookieService: CookieService, private modalService: NgbModal) {}

  close() {
    const userId = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    this.cookieService.set('user', `${userId}|${timestamp}`);
    this.activeModal.close();
  }

  submit() {
    this.cookieService.set('email', this.email);
    this.activeModal.close();
    const modalRef = this.modalService.open(ThankyouPopUpComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'notification_head',
    });
  }
}
