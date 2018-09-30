import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodDaysComponent } from './cl-food-days.component';

describe('ClFoodDaysComponent', () => {
  let component: ClFoodDaysComponent;
  let fixture: ComponentFixture<ClFoodDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
