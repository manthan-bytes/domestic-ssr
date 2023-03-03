import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoveTheLocalsComponent } from './love-the-locals.component';

describe('LoveTheLocalsComponent', () => {
  let component: LoveTheLocalsComponent;
  let fixture: ComponentFixture<LoveTheLocalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoveTheLocalsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoveTheLocalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
