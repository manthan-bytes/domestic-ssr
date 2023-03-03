import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlackloopComponent } from './blackloop.component';

describe('BlackloopComponent', () => {
  let component: BlackloopComponent;
  let fixture: ComponentFixture<BlackloopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BlackloopComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackloopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
