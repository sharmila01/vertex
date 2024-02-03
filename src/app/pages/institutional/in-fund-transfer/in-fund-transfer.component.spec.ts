import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InFundTransferComponent } from './in-fund-transfer.component';

describe('InFundTransferComponent', () => {
  let component: InFundTransferComponent;
  let fixture: ComponentFixture<InFundTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InFundTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InFundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
