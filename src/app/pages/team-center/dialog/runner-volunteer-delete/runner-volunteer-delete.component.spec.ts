import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunnerVolunteerDeleteComponent } from './runner-volunteer-delete.component';

describe('RunnerVolunteerDeleteComponent', () => {
  let component: RunnerVolunteerDeleteComponent;
  let fixture: ComponentFixture<RunnerVolunteerDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RunnerVolunteerDeleteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerVolunteerDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
