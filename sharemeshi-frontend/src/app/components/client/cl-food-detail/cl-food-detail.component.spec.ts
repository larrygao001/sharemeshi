import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodDetailComponent } from './cl-food-detail.component';

describe('ClFoodDetailComponent', () => {
  let component: ClFoodDetailComponent;
  let fixture: ComponentFixture<ClFoodDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
