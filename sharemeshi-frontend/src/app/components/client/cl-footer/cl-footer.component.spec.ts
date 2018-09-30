import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFooterComponent } from './cl-footer.component';

describe('ClFooterComponent', () => {
  let component: ClFooterComponent;
  let fixture: ComponentFixture<ClFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
