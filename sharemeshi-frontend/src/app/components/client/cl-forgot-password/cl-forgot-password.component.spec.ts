import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClForgotPasswordComponent } from './cl-forgot-password.component';

describe('ClForgotPasswordComponent', () => {
  let component: ClForgotPasswordComponent;
  let fixture: ComponentFixture<ClForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
