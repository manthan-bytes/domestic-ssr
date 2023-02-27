import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatesAndUpdatesComponent } from './dates-and-updates.component';

describe('DatesAndUpdatesComponent', () => {
  let component: DatesAndUpdatesComponent;
  let fixture: ComponentFixture<DatesAndUpdatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DatesAndUpdatesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatesAndUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
