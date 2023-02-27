import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-thankyou-popup',
  templateUrl: './thankyou-popup.component.html',
  styleUrls: ['./thankyou-popup.component.scss'],
})
export class ThankyouPopUpComponent {
  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
