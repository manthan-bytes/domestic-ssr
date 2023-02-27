import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderRacesComponent } from './header-races.component';

describe('HeaderRacesComponent', () => {
  let component: HeaderRacesComponent;
  let fixture: ComponentFixture<HeaderRacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderRacesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
