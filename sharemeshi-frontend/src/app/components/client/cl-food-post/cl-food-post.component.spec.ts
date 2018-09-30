import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFoodPostComponent } from './cl-food-post.component';

describe('ClFoodPostComponent', () => {
  let component: ClFoodPostComponent;
  let fixture: ComponentFixture<ClFoodPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFoodPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFoodPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
