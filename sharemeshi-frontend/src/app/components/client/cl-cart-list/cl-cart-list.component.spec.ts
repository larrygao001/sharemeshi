import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClCartListComponent } from './cl-cart-list.component';

describe('ClCartListComponent', () => {
  let component: ClCartListComponent;
  let fixture: ComponentFixture<ClCartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClCartListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClCartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
