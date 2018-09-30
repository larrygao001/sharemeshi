import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClNewsDetailComponent } from './cl-news-detail.component';

describe('ClNewsDetailComponent', () => {
  let component: ClNewsDetailComponent;
  let fixture: ComponentFixture<ClNewsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClNewsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClNewsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
