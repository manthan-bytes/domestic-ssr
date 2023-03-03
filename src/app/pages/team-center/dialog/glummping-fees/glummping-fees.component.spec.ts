import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlummpingFeesComponent } from './glummping-fees.component';

describe('GlummpingFeesComponent', () => {
  let component: GlummpingFeesComponent;
  let fixture: ComponentFixture<GlummpingFeesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GlummpingFeesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlummpingFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
