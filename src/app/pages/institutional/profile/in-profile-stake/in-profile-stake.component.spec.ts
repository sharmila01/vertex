import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProfileStakeComponent } from './in-profile-stake.component';

describe('InProfileStakeComponent', () => {
  let component: InProfileStakeComponent;
  let fixture: ComponentFixture<InProfileStakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProfileStakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProfileStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
