import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClHeaderComponent } from './cl-header.component';

describe('ClHeaderComponent', () => {
  let component: ClHeaderComponent;
  let fixture: ComponentFixture<ClHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
