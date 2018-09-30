import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClRegisterComponent } from './cl-register.component';

describe('ClRegisterComponent', () => {
  let component: ClRegisterComponent;
  let fixture: ComponentFixture<ClRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
