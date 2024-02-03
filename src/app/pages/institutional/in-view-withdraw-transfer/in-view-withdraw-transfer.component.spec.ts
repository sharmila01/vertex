import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InViewWithdrawTransferComponent } from './in-view-withdraw-transfer.component';

describe('InViewWithdrawTransferComponent', () => {
  let component: InViewWithdrawTransferComponent;
  let fixture: ComponentFixture<InViewWithdrawTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InViewWithdrawTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InViewWithdrawTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
