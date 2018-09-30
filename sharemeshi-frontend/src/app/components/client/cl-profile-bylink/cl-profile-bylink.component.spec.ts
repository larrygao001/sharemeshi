import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClProfileBylinkComponent } from './cl-profile-bylink.component';

describe('ClProfileBylinkComponent', () => {
  let component: ClProfileBylinkComponent;
  let fixture: ComponentFixture<ClProfileBylinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClProfileBylinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClProfileBylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
