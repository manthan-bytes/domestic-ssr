import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberRunStatusComponent } from './member-run-status.component';

describe('MemberRunStatusComponent', () => {
  let component: MemberRunStatusComponent;
  let fixture: ComponentFixture<MemberRunStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MemberRunStatusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRunStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
