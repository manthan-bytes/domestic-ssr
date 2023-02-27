import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ImageCropData } from 'src/app/@core/interfaces/common.interface';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss'],
})
export class ImageCropComponent implements OnInit {
  @Input() componentData: ImageCropData;

  croppedImage: string = null;

  constructor(private activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  closeModal(args) {
    this.activeModal.close(args);
  }
}
