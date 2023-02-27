import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-virtual-challenge-assign-leg',
  templateUrl: './assign-leg.component.html',
  styleUrls: ['./assign-leg.component.scss'],
})
export class AssignLegComponent implements OnInit {
  // @Input() isAssignLeg: any;
  /* TODO: Component is not using anywhere */

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  onDashboardScreenChange(screenName: string) {
    // this.virtualChallengeSharedDataService.setDashboardScreenName(screenName);
  }
}
