import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClLoginComponent } from './cl-login.component';

describe('ClLoginComponent', () => {
  let component: ClLoginComponent;
  let fixture: ComponentFixture<ClLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
