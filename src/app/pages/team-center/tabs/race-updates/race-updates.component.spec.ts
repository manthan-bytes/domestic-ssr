import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RaceUpdatesComponent } from './race-updates.component';

describe('RaceUpdatesComponent', () => {
  let component: RaceUpdatesComponent;
  let fixture: ComponentFixture<RaceUpdatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RaceUpdatesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
