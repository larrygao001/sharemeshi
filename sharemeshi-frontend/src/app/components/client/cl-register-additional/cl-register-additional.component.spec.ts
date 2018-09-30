import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClRegisterAdditionalComponent } from './cl-register-additional.component';

describe('ClRegisterAdditionalComponent', () => {
  let component: ClRegisterAdditionalComponent;
  let fixture: ComponentFixture<ClRegisterAdditionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClRegisterAdditionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClRegisterAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
