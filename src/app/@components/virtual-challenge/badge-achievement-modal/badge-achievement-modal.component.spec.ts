import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeAchievementModalComponent } from './badge-achievement-modal.component';

describe('BadgeAchievementModalComponent', () => {
  let component: BadgeAchievementModalComponent;
  let fixture: ComponentFixture<BadgeAchievementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BadgeAchievementModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeAchievementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
