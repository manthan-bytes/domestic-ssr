import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CovidCheckInComponent } from './covid-check-in.component';

describe('CovidCheckInComponent', () => {
  let component: CovidCheckInComponent;
  let fixture: ComponentFixture<CovidCheckInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CovidCheckInComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
