import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InNotificationDetailsComponent } from './in-notification-details.component';

describe('InNotificationDetailsComponent', () => {
  let component: InNotificationDetailsComponent;
  let fixture: ComponentFixture<InNotificationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InNotificationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InNotificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
