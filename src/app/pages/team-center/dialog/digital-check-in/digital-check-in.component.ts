import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-digital-check-in',
  templateUrl: './digital-check-in.component.html',
  styleUrls: ['./digital-check-in.component.scss'],
})
export class DigitalCheckInComponent implements OnInit {
  public checkInPoints = [
    {
      id: 0,
      text: '10x10 tent—shade all day',
    },
    {
      id: 1,
      text: '4 camp chairs',
    },
    {
      id: 2,
      text: '1 table',
    },
    {
      id: 3,
      text: '1 designated priority parking spot',
    },
    {
      id: 4,
      text: '1 basket of snacks',
    },
    {
      id: 5,
      text: '1 celebratory bottle of champagne',
    },
    {
      id: 6,
      text: 'No setup or tear down',
    },
    {
      id: 7,
      text: 'Free jokes upon arrival',
    },
  ];

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  closeModal() {
    this.activeModal.close();
  }
}
