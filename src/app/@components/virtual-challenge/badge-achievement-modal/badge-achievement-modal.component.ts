import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { virtualChallengeRoutes } from 'src/app/@core/utils/routes-path.constant.service';

@Component({
  selector: 'app-badge-achievement-modal',
  templateUrl: './badge-achievement-modal.component.html',
  styleUrls: ['./badge-achievement-modal.component.scss'],
})
export class BadgeAchievementModalComponent {
  constructor(private activeModal: NgbActiveModal) {}
  @Input() componentData;
  virtualChallengeRoutes = virtualChallengeRoutes;

  closeModal(args) {
    this.activeModal.close(args);
  }
}
