import { Component, Input } from '@angular/core';
import { Testimonials } from 'src/app/@core/interfaces/testimonials.interface';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent {
  @Input() Quotes: Testimonials[];
  constructor() {}
  TestimonialConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
  };
}
