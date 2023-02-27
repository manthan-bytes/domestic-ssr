import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-waiver-modal',
  templateUrl: './waiver-modal.component.html',
  styleUrls: ['./waiver-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WaiverModalComponent implements OnInit {
  @Input() componentData;

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit(): void {
    setTimeout(() => {
      document.querySelector('#waiver_body').scrollTo(0, 0);
      document.getElementById('waiver_body').scrollIntoView({ block: 'nearest' });
    }, 100);
    this.translate.setDefaultLang('en');
  }

  printWaiver() {
    // const popupWin = window.open('', '_blank', 'top=0,left=0,height=700,width=800%');
    // popupWin.document.open();
    // popupWin.document.write(`
    //   <html>
    //     <head>
    //       <title></title>
    //       <style>
    //       //........Customized style.......
    //       </style>
    //     </head>
    //     <body onload="window.print()">
    //       ${this.componentData.waiverInfo}
    //     </body>
    //   </html>`);
    // popupWin.document.close();
  }

  closeModal() {
    this.activeModal.close();
  }
}
