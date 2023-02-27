import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-faq-modal',
  templateUrl: './faq-modal.component.html',
  styleUrls: ['./faq-modal.component.scss'],
})
export class FaqModalComponent {
  @Input() componentData;
  constructor(private activeModal: NgbActiveModal) {}

  closeModal(args) {
    this.activeModal.close(args);
  }
}
