import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoadComponent } from './road.component';

describe('RoadComponent', () => {
  let component: RoadComponent;
  let fixture: ComponentFixture<RoadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
