import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RagnarNationComponent } from './ragnar-nation.component';

describe('RagnarNationComponent', () => {
  let component: RagnarNationComponent;
  let fixture: ComponentFixture<RagnarNationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RagnarNationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RagnarNationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
