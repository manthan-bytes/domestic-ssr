import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-virtual-up-sell-modal',
  templateUrl: './virtual-up-sell-modal.component.html',
  styleUrls: ['./virtual-up-sell-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VirtualUpSellModalComponent implements OnInit {
  @Input() fromParent;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }
}
