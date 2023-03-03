import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss'],
})
export class StaticPagesComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }
}
