import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcDashboardComponent } from './dc-dashboard.component';

describe('DcDashboardComponent', () => {
  let component: DcDashboardComponent;
  let fixture: ComponentFixture<DcDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DcDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
