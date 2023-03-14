import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VirtualChallengeComponent } from './virtual-challenge.component';

describe('VirtualChallengeComponent', () => {
  let component: VirtualChallengeComponent;
  let fixture: ComponentFixture<VirtualChallengeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualChallengeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
