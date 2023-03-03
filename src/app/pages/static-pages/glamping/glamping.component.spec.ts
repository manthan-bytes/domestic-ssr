import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlampingComponent } from './glamping.component';

describe('GlampingComponent', () => {
  let component: GlampingComponent;
  let fixture: ComponentFixture<GlampingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GlampingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlampingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
