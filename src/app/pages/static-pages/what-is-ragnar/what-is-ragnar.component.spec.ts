import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhatIsRagnarComponent } from './what-is-ragnar.component';

describe('WhatIsRagnarComponent', () => {
  let component: WhatIsRagnarComponent;
  let fixture: ComponentFixture<WhatIsRagnarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WhatIsRagnarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIsRagnarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
