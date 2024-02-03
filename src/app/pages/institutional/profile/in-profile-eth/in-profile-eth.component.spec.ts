import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProfileEthComponent } from './in-profile-eth.component';

describe('InProfileEthComponent', () => {
  let component: InProfileEthComponent;
  let fixture: ComponentFixture<InProfileEthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProfileEthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProfileEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
