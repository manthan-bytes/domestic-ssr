import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CharitiesComponent } from './charities.component';

describe('CharitiesComponent', () => {
  let component: CharitiesComponent;
  let fixture: ComponentFixture<CharitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CharitiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
