import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDatePickerComponent } from './sub-date-picker.component';

describe('SubDatePickerComponent', () => {
  let component: SubDatePickerComponent;
  let fixture: ComponentFixture<SubDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
