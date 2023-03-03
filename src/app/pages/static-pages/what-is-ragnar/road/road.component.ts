import { Component, OnInit } from '@angular/core';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoModalComponent } from '@core/modal/video-modal/video-modal.component';
import { DataLayerService } from '@core/utils';
import { NewVisitorService } from '@core/data';
@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.scss'],
})
export class RoadComponent implements OnInit {
  public headerRoutes = headerRoutes;
  constructor(private modalService: NgbModal, private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}

  openVideoModal() {
    const modalRef = this.modalService.open(VideoModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
    });
    modalRef.componentInstance.videoLink = 'https://player.vimeo.com/video/231762440';
  }
  ngOnInit(): void {
    this.newVisitorService.popUp();
    this.dataLayerService.pageInitEvent({
      screen_name: 'what-is-ragnar-road',
      pagePostType: 'whatIsRagnarRoad',
      pagePostType2: 'single-page',
    });
  }
}
