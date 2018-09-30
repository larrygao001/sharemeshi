import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClResetPasswordComponent } from './cl-reset-password.component';

describe('ClResetPasswordComponent', () => {
  let component: ClResetPasswordComponent;
  let fixture: ComponentFixture<ClResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
