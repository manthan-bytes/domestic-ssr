import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PublicShareComponent } from './public-share.component';

describe('PublicShareComponent', () => {
  let component: PublicShareComponent;
  let fixture: ComponentFixture<PublicShareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublicShareComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
