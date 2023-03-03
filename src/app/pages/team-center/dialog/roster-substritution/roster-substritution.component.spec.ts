import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RosterSubstritutionComponent } from './roster-substritution.component';

describe('RosterSubstritutionComponent', () => {
  let component: RosterSubstritutionComponent;
  let fixture: ComponentFixture<RosterSubstritutionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RosterSubstritutionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterSubstritutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
