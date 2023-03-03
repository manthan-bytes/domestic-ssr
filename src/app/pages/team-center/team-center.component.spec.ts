import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamCenterComponent } from './team-center.component';

describe('TeamCenterComponent', () => {
  let component: TeamCenterComponent;
  let fixture: ComponentFixture<TeamCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamCenterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
