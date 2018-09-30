import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodManagementComponent } from './cl-food-management.component';

describe('ClFoodManagementComponent', () => {
  let component: ClFoodManagementComponent;
  let fixture: ComponentFixture<ClFoodManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
