import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClBeginnerTutorialComponent } from './cl-beginner-tutorial.component';

describe('ClBeginnerTutorialComponent', () => {
  let component: ClBeginnerTutorialComponent;
  let fixture: ComponentFixture<ClBeginnerTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClBeginnerTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClBeginnerTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
