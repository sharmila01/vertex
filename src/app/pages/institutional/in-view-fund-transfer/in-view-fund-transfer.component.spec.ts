import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InViewFundTransferComponent } from './in-view-fund-transfer.component';

describe('InViewFundTransferComponent', () => {
  let component: InViewFundTransferComponent;
  let fixture: ComponentFixture<InViewFundTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InViewFundTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InViewFundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
