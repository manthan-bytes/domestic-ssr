import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StaticPageService } from '@core/data';
import { BannersList } from '@core/interfaces/static-pages.interface';
import * as $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  captionEffect = false;
  imageEffect = true;
  activeImage = 0;
  isThumbSelected: string | number;
  title: string;
  description: string;
  buttonOneTitle: string;
  buttonOneLink: string;
  buttonTwoTitle: string;
  buttonTwoLink: string;
  isSelfTarget: string | boolean;
  isImageThumbClick = true;
  imagesThumb: BannersList[];

  constructor(private route: ActivatedRoute, private router: Router, private staticPageService: StaticPageService) {}

  ngOnInit(): void {
    // tslint:disable-next-line: no-any
    this.staticPageService.getBannersAndQuotes().subscribe((response: any) => {
      this.imagesThumb = response;
      this.route.queryParams.subscribe((params) => {
        const index = this.imagesThumb.findIndex((z) => params.section === z.thumbTitle);
        if (index > 0) {
          this.imageChange(index, params.section);
        } else {
          this.imageChange(0, this.imagesThumb[0].thumbTitle);
        }
      });
    });

    $('.mobile-nav-custom-tab > div').on('click', () => {
      $('.mobile-nav-custom-tab > div').each(() => {
        $('.mobile-nav-custom-tab > div').removeClass('active');
      });

      $(this).addClass('active');
    });

    $('.mobile-nav-custom-tab > div').on('click', () => {
      // max left scroll
      // const maxScrollLeft =
      //   $('.mobile-nav-custom-tab').scrollLeft('.mobile-nav-custom-tab').prop('scrollWidth') - $('.mobile-nav-custom-tab').width();
      const left = $(this).offset().left;
      const width = $('.mobile-nav-custom-tab').width();
      const diff = left - width / 2;
      // $(".mobile-nav-custom-tab").scrollLeft($(".mobile-nav-custom-tab").scrollLeft()+diff)
      $('#timepicker').animate({
        scrollLeft: diff,
      });
    });
  }

  imageChange(image, sectionName) {
    this.router.navigate([], {
      queryParams: {
        section: sectionName,
      },
    });

    this.activeImage = -1;
    this.captionEffect = true;

    setTimeout(() => {
      this.captionEffect = false;
      this.imageEffect = true;
      this.activeImage = image;
      this.isThumbSelected = this.imagesThumb[image].id;
      this.title = this.imagesThumb[image].title;
      this.description = this.imagesThumb[image].description;
      this.buttonOneTitle = this.imagesThumb[image].buttonOneTitle;
      this.buttonOneLink = this.imagesThumb[image].buttonOneLink;
      this.buttonTwoTitle = this.imagesThumb[image].buttonTwoTitle;
      this.buttonTwoLink = this.imagesThumb[image].buttonTwoLink;
      this.isSelfTarget = this.imagesThumb[image].isSelfTarget ? '_blank' : false;
    }, 200);

    this.imageEffect = false;
    this.isImageThumbClick = true;
  }
}
