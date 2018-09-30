import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cl2ndVerificationComponent } from './cl-2nd-verification.component';

describe('Cl2ndVerificationComponent', () => {
  let component: Cl2ndVerificationComponent;
  let fixture: ComponentFixture<Cl2ndVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cl2ndVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cl2ndVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
