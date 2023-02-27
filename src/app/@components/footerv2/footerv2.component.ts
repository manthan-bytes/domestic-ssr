import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { footerRoutes } from 'src/app/@core/utils/routes-path.constant.service';
@Component({
  selector: 'app-footerv2',
  templateUrl: './footerv2.component.html',
  styleUrls: ['./footerv2.component.scss'],
})
export class Footerv2Component implements OnInit {
  constructor(private translate: TranslateService, private router: Router) {}
  public year: number;
  public footerRoutes = footerRoutes;
  public isMainRouterVisible = false;

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.translate.setDefaultLang('en');
  }
}
