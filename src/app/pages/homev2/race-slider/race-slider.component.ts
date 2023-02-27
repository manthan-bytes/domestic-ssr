import { Component, Inject, Input, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';
import { BannersListNew } from 'src/app/@core/interfaces/static-pages.interface';
import { isPlatformBrowser } from '@angular/common';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-race-slider',
  templateUrl: './race-slider.component.html',
  styleUrls: ['./race-slider.component.scss'],
})
export class RaceSliderComponent implements OnInit {
  homeRaceSlider: HTMLElement;
  innerWidth: number;
  bannerData;
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  @Input() banners: BannersListNew[];
  totalSlides = 0;
  currentSlide = 1;
  prevSlideCount = 0;
  showSliderCounter = false;
  slides: BannersListNew[] = [];
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: false,
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '30px',
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };
  constructor(private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.getHomepageData();
   this.registerOrientationChangeEvent();
  }

  registerOrientationChangeEvent() {
    if (isPlatformBrowser(this.platformId)) {
      const orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      const eventHandler = () => {
        this.slickModal.unslick();
        this.slickModal.initSlick();
        this.slickModal.slickGoTo(1);
      };
      window.addEventListener(orientationEvent, eventHandler, false);
    }
  }


  getHomepageData() {
    this.slides = this.banners.filter((ele: BannersListNew) => ele.isMainBanner === false);
    this.bannerData = this.banners.filter((ele: BannersListNew) => ele.isMainBanner === true)[0];
    this.totalSlides = Math.ceil(this.slides.length / this.slideConfig.slidesToShow);
    this.currentSlide = 1;
  }

  slickInit({ slick }) {
    this.showSliderCounter = false;
    if (slick.$nextArrow[0].className === 'slick-next slick-arrow') {
      this.showSliderCounter = true;
    }

    for (const ele of this.slideConfig.responsive) {
      if (window.innerWidth <= ele.breakpoint) {
        this.totalSlides = Math.ceil(this.slides.length / ele.settings.slidesToShow);
        break;
      }
    }
  }

  breakpoint({ event, slick, breakpoint }) {
    this.showSliderCounter = false;
    if (slick.$nextArrow[0].className === 'slick-next slick-arrow') {
      this.showSliderCounter = true;
    }

    for (const ele of this.slideConfig.responsive) {
      if (isPlatformBrowser(this.platformId) && window.innerWidth <= ele.breakpoint) {
        this.totalSlides = Math.ceil(this.slides.length / ele.settings.slidesToShow);
        this.currentSlide = 1;
        break;
      }
    }
  }

  beforeChange({ event, slick, breakpoint }) {
    this.prevSlideCount = slick.currentSlide;
  }

  afterChange(e) {
    if (e.slick.activeBreakpoint === 991) {
      if (e.slick.currentSlide === 0 || e.slick.currentSlide === 1) {
        this.currentSlide = e.slick.currentSlide = 0;
      } else {
        if (e.slick.currentSlide === 2) {
          e.slick.currentSlide > this.prevSlideCount
            ? (this.currentSlide = e.slick.currentSlide / 2 + 1)
            : (this.currentSlide = e.slick.currentSlide);
        } else {
          e.slick.currentSlide > this.prevSlideCount / 2
            ? (this.currentSlide = e.slick.currentSlide / 2 + 1)
            : (this.currentSlide = e.slick.currentSlide / 2 - 1);
        }
      }
    } else if (e.slick.activeBreakpoint === 575) {
      if (e.slick.currentSlide === 0) {
        this.currentSlide = 1;
      } else {
        e.slick.currentSlide > this.prevSlideCount
          ? (this.currentSlide = e.slick.currentSlide + 1)
          : (this.currentSlide = this.prevSlideCount);
      }
    } else if (e.slick.activeBreakpoint === 1367) {
      if (e.slick.currentSlide === 0) {
        this.currentSlide = 1;
      } else {
        if (e.slick.currentSlide === 0 || e.slick.currentSlide === 1 || e.slick.currentSlide === 2) {
          this.currentSlide = e.slick.currentSlide = 1;
        } else {
          e.slick.currentSlide > this.prevSlideCount / 3
            ? (this.currentSlide = e.slick.currentSlide / 3 + 1)
            : (this.currentSlide = e.slick.currentSlide / 3 - 1);
        }
      }
    } else {
      e.slick.currentSlide > this.prevSlideCount ? ++this.currentSlide : --this.currentSlide;
      if (this.currentSlide === 0) {
        this.currentSlide = 1;
      } else if (this.currentSlide > this.totalSlides) {
        this.currentSlide = this.totalSlides;
      }
    }
  }
  moveToNextScreen(el: HTMLElement) {
    const headerHeight = $('.site-header').innerHeight();
    $('html, body').animate(
      {
        scrollTop: $('.home-race-slider').offset().top - headerHeight,
      },
      500,
    );
    //  document.getElementById('homeRaceSlider').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  getBannerImageBasedOnScreenType() {
    if (isPlatformBrowser(this.platformId) && (window.innerWidth > window.innerHeight)) {
      return this.bannerData.landscapeBanner;
    } else {
      return this.bannerData.portraitBanner;
    }
  }
}
