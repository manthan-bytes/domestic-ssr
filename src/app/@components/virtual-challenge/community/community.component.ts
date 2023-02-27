import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-virtual-challenge-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }
}
