import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DigitalCheckInComponent } from './digital-check-in.component';

describe('DigitalCheckInComponent', () => {
  let component: DigitalCheckInComponent;
  let fixture: ComponentFixture<DigitalCheckInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalCheckInComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
