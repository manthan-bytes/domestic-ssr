import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roster-substritution',
  templateUrl: './roster-substritution.component.html',
  styleUrls: ['./roster-substritution.component.scss'],
})
export class RosterSubstritutionComponent {
  constructor(private activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
