import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InUpgradeTierComponent } from './in-upgrade-tier.component';

describe('InUpgradeTierComponent', () => {
  let component: InUpgradeTierComponent;
  let fixture: ComponentFixture<InUpgradeTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InUpgradeTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InUpgradeTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
