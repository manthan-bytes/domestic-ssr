import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultsPhotosComponent } from './results-photos.component';

describe('ResultsPhotosComponent', () => {
  let component: ResultsPhotosComponent;
  let fixture: ComponentFixture<ResultsPhotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsPhotosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
