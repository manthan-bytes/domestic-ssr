import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrainingRoadComponent } from './training-road.component';

describe('TrainingRoadComponent', () => {
  let component: TrainingRoadComponent;
  let fixture: ComponentFixture<TrainingRoadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingRoadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingRoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
