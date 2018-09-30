import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClTermConditionComponent } from './cl-term-condition.component';

describe('ClTermConditionComponent', () => {
  let component: ClTermConditionComponent;
  let fixture: ComponentFixture<ClTermConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClTermConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClTermConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
