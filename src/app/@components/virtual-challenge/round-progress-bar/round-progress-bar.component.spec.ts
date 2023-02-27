import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoundProgressBarComponent } from './round-progress-bar.component';

describe('RoundProgressBarComponent', () => {
  let component: RoundProgressBarComponent;
  let fixture: ComponentFixture<RoundProgressBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoundProgressBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
