import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
declare const $: { (args) };
@Component({
  selector: 'app-virtual-challenge-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class VirtualChallengeFooterComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  @Input() currentScreen: string;
  @Input() showInviteButton: boolean;

  ngOnInit(): void {
    console.log('test')
    // this.translate.setDefaultLang('en');
    // $('#testimonialobf').carousel();
  }
}
