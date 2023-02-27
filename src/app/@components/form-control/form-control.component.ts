import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonModelDialogComponent } from '../virtual-challenge/common-model-dialog/common-model-dialog.component';
import { VirtualUpSellModalComponent } from '../virtual-challenge/virtual-up-sell-modal/virtual-up-sell-modal.component';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
})
export class FormControlComponent implements OnInit {
  constructor(private modalService: NgbModal, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  openUpSell() {
    const modalRef = this.modalService.open(VirtualUpSellModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'upsell',
    });

    const data = {
      prop1: 'Some Data',
      prop2: 'From Parent Component',
      prop3: 'This Can be anything',
    };

    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (result) => {},
      (reason) => {},
    );
  }

  challengeProgress() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'challenge_progress',
    });

    modalRef.componentInstance.componentData = {
      type: 'challengeProgress',
      title: 'Challenge Progress',
      progress: 12,
    };
  }

  renameTeam() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'rename_team',
    });

    modalRef.componentInstance.componentData = {
      type: 'renameTeam',
      title: 'Rename Team',
      teamName: 'Testing team',
    };
  }

  openWaiver() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'y_info',
    });

    modalRef.componentInstance.componentData = {
      type: 'waiver',
      title: 'Your Information',
      userDetails: {
        name: 'username',
      },
    };
  }

  showPendingInvites() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'pending_invit',
    });

    modalRef.componentInstance.componentData = {
      type: 'invite',
      title: 'Challenge Invites',
      inviteDetails: 'Invite detail obj',
    };
  }
}
