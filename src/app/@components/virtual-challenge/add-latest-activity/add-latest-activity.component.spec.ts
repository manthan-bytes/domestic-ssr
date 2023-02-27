import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLatestActivityComponent } from './add-latest-activity.component';

describe('AddLatestActivityComponent', () => {
  let component: AddLatestActivityComponent;
  let fixture: ComponentFixture<AddLatestActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLatestActivityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLatestActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
