import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClPurchasedListComponent } from './cl-purchased-list.component';

describe('ClPurchasedListComponent', () => {
  let component: ClPurchasedListComponent;
  let fixture: ComponentFixture<ClPurchasedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClPurchasedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClPurchasedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
