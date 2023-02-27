import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignLegComponent } from './assign-leg.component';

describe('AssignLegComponent', () => {
  let component: AssignLegComponent;
  let fixture: ComponentFixture<AssignLegComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssignLegComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
