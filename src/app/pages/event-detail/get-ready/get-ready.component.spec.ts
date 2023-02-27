import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetReadyComponent } from './get-ready.component';

describe('GetReadyComponent', () => {
  let component: GetReadyComponent;
  let fixture: ComponentFixture<GetReadyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GetReadyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
