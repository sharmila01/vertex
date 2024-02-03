import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InTransactionHistoryComponent } from './in-transaction-history.component';

describe('InTransactionHistoryComponent', () => {
  let component: InTransactionHistoryComponent;
  let fixture: ComponentFixture<InTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
