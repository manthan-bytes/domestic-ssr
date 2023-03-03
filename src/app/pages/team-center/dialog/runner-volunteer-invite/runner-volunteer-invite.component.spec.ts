import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RunnerVolunteerInviteComponent } from './runner-volunteer-invite.component';

describe('RunnerVolunteerInviteComponent', () => {
  let component: RunnerVolunteerInviteComponent;
  let fixture: ComponentFixture<RunnerVolunteerInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RunnerVolunteerInviteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerVolunteerInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
