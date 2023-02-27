import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { staticRoutes } from 'src/app/@core/utils/routes-path.constant.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  goToHome() {
    this.router.navigate([staticRoutes.home]);
  }
}
