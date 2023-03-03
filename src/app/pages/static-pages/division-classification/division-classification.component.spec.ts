import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DivisionClassificationComponent } from './division-classification.component';

describe('DivisionClassificationComponent', () => {
  let component: DivisionClassificationComponent;
  let fixture: ComponentFixture<DivisionClassificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionClassificationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
