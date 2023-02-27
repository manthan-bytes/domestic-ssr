import { Injectable } from '@angular/core';
import { NewUserPopupComponent } from '@components/new-user-popup/new-user-popup.component';
import { LocalStorageService } from '@core/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class NewVisitorService {
  constructor(private modalService: NgbModal, private cookieService: CookieService, private localStorageService: LocalStorageService) {}

  popUp() {
    const userData = this.localStorageService.getUser();
    if (!userData) {
      const userCookie = this.cookieService.get('user');
      const isSubmittedEmail = this.cookieService.get('email');

      if (!userCookie) {
        if (!isSubmittedEmail) {
          // new User popup
          const modalRef = this.modalService.open(NewUserPopupComponent, {
            scrollable: true,
            centered: true,
            keyboard: false,
            backdrop: 'static',
            windowClass: 'notification_head',
          });
        }
      } else {
        const [userId, timestamp] = userCookie.split('|');
        const lastVisit = new Date(parseInt(timestamp, 10));
        const daysSinceLastVisit = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastVisit > 30) {
          if (!isSubmittedEmail) {
            // new User popup
            const modalRef = this.modalService.open(NewUserPopupComponent, {
              scrollable: true,
              centered: true,
              keyboard: false,
              backdrop: 'static',
              windowClass: 'notification_head',
            });
          }
        }
      }
    }
  }
}
