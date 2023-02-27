import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddRunComponent } from './add-run.component';

describe('AddRunComponent', () => {
  let component: AddRunComponent;
  let fixture: ComponentFixture<AddRunComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddRunComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
