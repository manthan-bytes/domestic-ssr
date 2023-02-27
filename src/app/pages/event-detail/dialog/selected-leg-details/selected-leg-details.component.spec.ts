import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectedLegDetailsComponent } from './selected-leg-details.component';

describe('SelectedLegDetailsComponent', () => {
  let component: SelectedLegDetailsComponent;
  let fixture: ComponentFixture<SelectedLegDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedLegDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedLegDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
