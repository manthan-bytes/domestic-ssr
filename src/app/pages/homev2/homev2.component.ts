import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { StaticPageService } from 'src/app/@core/data';
import { BannersListNew, Testimonials } from 'src/app/@core/interfaces/static-pages.interface';
import { DataLayerService } from 'src/app/@core/utils';
import { isPlatformBrowser } from '@angular/common';


// import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-homev2',
  templateUrl: './homev2.component.html',
  styleUrls: ['./homev2.component.scss'],
  // encapsulation : ViewEncapsulation.Emulated
})
export class Homev2Component implements OnInit, OnDestroy {
  bannerData: BannersListNew[];
  quotes: Testimonials[];

  constructor(private staticPageService: StaticPageService, private dataLayerService: DataLayerService, private el: ElementRef,
    private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object,private elRef:ElementRef) {}

  ngOnInit() {
    console.log('push')
    // this.dataLayerService.pageInitEvent({
    //   screen_name: 'homev2',
    //   visitorEmail: '',
    //   pagePostType: 'homePage',
    //   pagePostType2: 'single-page',
    // });
    this.staticPageService.getBannersAndQuotes().subscribe((response) => {
      if (response.banners.length) {
        this.bannerData = response.banners;
      }
      if (response.quotes.length) {
        this.quotes = response.quotes;
      }
    });

    // const header = this.elRef.nativeElement.querySelector('site-header');
    // header.classList.add('sticky-header');
    // window.addEventListener('scroll', this.scrollFunc);
  }
  ngOnDestroy(): void {
    const header = this.el.nativeElement.querySelector('.sticky-header');
    if (header) {
    this.renderer.removeClass(header, 'sticky-header');
    }
  }
  scrollFunc() {
    const y = isPlatformBrowser(this.platformId) ? window.scrollY : 0;
    const header = this.el.nativeElement.querySelector('.sticky-header');
    if (isPlatformBrowser(this.platformId) && header) {
      if (y > 10) {
        this.renderer.addClass(header, 'fixed');
      } else {
        this.renderer.removeClass(header, 'fixed');
      }
    }
  }
  slickInit(e) {
    // console.log('slick initialized');
  }

  breakpoint(e) {
    // console.log('breakpoint');
  }

  afterChange(e) {
    // console.log('afterChange');
    // let i = (currentSlide ? currentSlide : 0) + 1;
    // console.log(i + '/' + currentSlide);
    // console.log(slick.slideCount);
  }
}
