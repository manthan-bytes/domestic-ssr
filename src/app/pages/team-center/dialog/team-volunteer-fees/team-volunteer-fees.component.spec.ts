import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamVolunteerFeesComponent } from './team-volunteer-fees.component';

describe('TeamVolunteerFeesComponent', () => {
  let component: TeamVolunteerFeesComponent;
  let fixture: ComponentFixture<TeamVolunteerFeesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamVolunteerFeesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamVolunteerFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
