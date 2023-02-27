import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent {
  @Input() videoLink;
  constructor() {}
}
