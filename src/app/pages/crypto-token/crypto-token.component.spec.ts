import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoTokenComponent } from './crypto-token.component';

describe('CryptoTokenComponent', () => {
  let component: CryptoTokenComponent;
  let fixture: ComponentFixture<CryptoTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
