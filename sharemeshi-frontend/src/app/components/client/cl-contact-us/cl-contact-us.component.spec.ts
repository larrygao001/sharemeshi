import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClContactUsComponent } from './cl-contact-us.component';

describe('ClContactUsComponent', () => {
  let component: ClContactUsComponent;
  let fixture: ComponentFixture<ClContactUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClContactUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
