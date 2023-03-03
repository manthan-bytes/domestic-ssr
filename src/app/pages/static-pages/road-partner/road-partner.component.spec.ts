import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoadPartnerComponent } from './road-partner.component';

describe('RoadPartnerComponent', () => {
  let component: RoadPartnerComponent;
  let fixture: ComponentFixture<RoadPartnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoadPartnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
