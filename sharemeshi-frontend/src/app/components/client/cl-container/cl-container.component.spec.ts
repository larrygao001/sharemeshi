import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClContainerComponent } from './cl-container.component';

describe('ClContainerComponent', () => {
  let component: ClContainerComponent;
  let fixture: ComponentFixture<ClContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
