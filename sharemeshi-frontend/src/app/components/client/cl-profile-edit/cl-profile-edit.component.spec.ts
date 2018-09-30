import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClProfileEditComponent } from './cl-profile-edit.component';

describe('ClProfileEditComponent', () => {
  let component: ClProfileEditComponent;
  let fixture: ComponentFixture<ClProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
