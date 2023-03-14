import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-virtual-challenge',
  templateUrl: './virtual-challenge.component.html',
  styleUrls: ['./virtual-challenge.component.scss'],
})
export class VirtualChallengeComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  onActivate(event) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }
}
