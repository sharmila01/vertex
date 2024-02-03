import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeB3Component } from './upgrade-b3.component';

describe('UpgradeB3Component', () => {
  let component: UpgradeB3Component;
  let fixture: ComponentFixture<UpgradeB3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeB3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeB3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
