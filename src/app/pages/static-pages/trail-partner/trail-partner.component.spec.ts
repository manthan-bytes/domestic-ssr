import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrailPartnerComponent } from './trail-partner.component';

describe('TrailPartnerComponent', () => {
  let component: TrailPartnerComponent;
  let fixture: ComponentFixture<TrailPartnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrailPartnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
