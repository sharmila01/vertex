import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InWithdrawTransferComponent } from './in-withdraw-transfer.component';

describe('InWithdrawTransferComponent', () => {
  let component: InWithdrawTransferComponent;
  let fixture: ComponentFixture<InWithdrawTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InWithdrawTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InWithdrawTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
