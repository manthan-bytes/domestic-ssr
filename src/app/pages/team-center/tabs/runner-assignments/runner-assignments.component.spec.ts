import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunnerAssignmentsComponent } from './runner-assignments.component';

describe('RunnerAssignmentsComponent', () => {
  let component: RunnerAssignmentsComponent;
  let fixture: ComponentFixture<RunnerAssignmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RunnerAssignmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
