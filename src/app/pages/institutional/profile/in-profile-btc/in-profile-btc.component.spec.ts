import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProfileBtcComponent } from './in-profile-btc.component';

describe('InProfileBtcComponent', () => {
  let component: InProfileBtcComponent;
  let fixture: ComponentFixture<InProfileBtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProfileBtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProfileBtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
