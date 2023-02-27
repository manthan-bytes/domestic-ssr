import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VirtualUpSellModalComponent } from './virtual-up-sell-modal.component';

describe('VirtualUpSellModalComponent', () => {
  let component: VirtualUpSellModalComponent;
  let fixture: ComponentFixture<VirtualUpSellModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualUpSellModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualUpSellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
