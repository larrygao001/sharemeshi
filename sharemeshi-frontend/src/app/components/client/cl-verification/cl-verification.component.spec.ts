import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClVerificationComponent } from './cl-verification.component';

describe('ClVerificationComponent', () => {
  let component: ClVerificationComponent;
  let fixture: ComponentFixture<ClVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
