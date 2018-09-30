import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClHomeComponent } from './cl-home.component';

describe('ClHomeComponent', () => {
  let component: ClHomeComponent;
  let fixture: ComponentFixture<ClHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
