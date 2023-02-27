import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseTableComponent } from './course-table.component';

describe('CourseTableComponent', () => {
  let component: CourseTableComponent;
  let fixture: ComponentFixture<CourseTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CourseTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
