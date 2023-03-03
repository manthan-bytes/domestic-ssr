import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmbassadorFormComponent } from './ambassador-form.component';

describe('AmbassadorFormComponent', () => {
  let component: AmbassadorFormComponent;
  let fixture: ComponentFixture<AmbassadorFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AmbassadorFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
