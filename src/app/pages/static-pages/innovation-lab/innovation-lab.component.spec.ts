import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InnovationLabComponent } from './innovation-lab.component';

describe('InnovationLabComponent', () => {
  let component: InnovationLabComponent;
  let fixture: ComponentFixture<InnovationLabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InnovationLabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
