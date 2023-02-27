import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-virtual-challenge-member-run-status',
  templateUrl: './member-run-status.component.html',
  styleUrls: ['./member-run-status.component.scss'],
})
export class MemberRunStatusComponent implements OnInit {
  // @Input() memberData: any;
  /* TODO: Component is not using anywhere */
  public members = [
    {
      id: 1,
      run: 10,
    },
    {
      id: 2,
      run: 20,
    },
    {
      id: 1,
      run: 30,
    },
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }
}
