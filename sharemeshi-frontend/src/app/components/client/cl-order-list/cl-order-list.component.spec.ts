import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClOrderListComponent } from './cl-order-list.component';

describe('ClOrderListComponent', () => {
  let component: ClOrderListComponent;
  let fixture: ComponentFixture<ClOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
