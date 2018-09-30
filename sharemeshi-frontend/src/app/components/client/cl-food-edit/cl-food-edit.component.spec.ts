import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodEditComponent } from './cl-food-edit.component';

describe('ClFoodEditComponent', () => {
  let component: ClFoodEditComponent;
  let fixture: ComponentFixture<ClFoodEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
