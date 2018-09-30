import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClChattingRoomComponent } from './cl-chatting-room.component';

describe('ClChattingRoomComponent', () => {
  let component: ClChattingRoomComponent;
  let fixture: ComponentFixture<ClChattingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClChattingRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClChattingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
