import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WaiverModalComponent } from './waiver-modal.component';

describe('WaiverModalComponent', () => {
  let component: WaiverModalComponent;
  let fixture: ComponentFixture<WaiverModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WaiverModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
