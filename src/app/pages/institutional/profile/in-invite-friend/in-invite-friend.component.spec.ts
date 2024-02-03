import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InInviteFriendComponent } from './in-invite-friend.component';

describe('InInviteFriendComponent', () => {
  let component: InInviteFriendComponent;
  let fixture: ComponentFixture<InInviteFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InInviteFriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InInviteFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
