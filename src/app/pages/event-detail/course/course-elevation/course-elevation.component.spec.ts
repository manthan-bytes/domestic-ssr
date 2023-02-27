import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseElevationComponent } from './course-elevation.component';

describe('CourseElevationComponent', () => {
  let component: CourseElevationComponent;
  let fixture: ComponentFixture<CourseElevationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CourseElevationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
