import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClLandingComponent } from './cl-landing.component';

describe('ClLandingComponent', () => {
  let component: ClLandingComponent;
  let fixture: ComponentFixture<ClLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
