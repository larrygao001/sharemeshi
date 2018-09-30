import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClAboutusComponent } from './cl-aboutus.component';

describe('ClAboutusComponent', () => {
  let component: ClAboutusComponent;
  let fixture: ComponentFixture<ClAboutusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClAboutusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClAboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
