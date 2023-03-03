import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SunsetComponent } from './sunset.component';

describe('SunsetComponent', () => {
  let component: SunsetComponent;
  let fixture: ComponentFixture<SunsetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SunsetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
