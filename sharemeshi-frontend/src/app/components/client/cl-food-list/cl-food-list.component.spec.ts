import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodListComponent } from './cl-food-list.component';

describe('ClFoodListComponent', () => {
  let component: ClFoodListComponent;
  let fixture: ComponentFixture<ClFoodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
