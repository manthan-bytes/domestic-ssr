import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseTeamComponent } from './choose-team.component';

describe('ChooseTeamComponent', () => {
  let component: ChooseTeamComponent;
  let fixture: ComponentFixture<ChooseTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseTeamComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
