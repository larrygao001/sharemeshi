import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClRegisterCompleteComponent } from './cl-register-complete.component';

describe('ClRegisterCompleteComponent', () => {
  let component: ClRegisterCompleteComponent;
  let fixture: ComponentFixture<ClRegisterCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClRegisterCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClRegisterCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
