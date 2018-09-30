import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClProfileComponent } from './cl-profile.component';

describe('ClProfileComponent', () => {
  let component: ClProfileComponent;
  let fixture: ComponentFixture<ClProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
