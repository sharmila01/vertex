import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InOfferingsComponent } from './in-offerings.component';

describe('InOfferingsComponent', () => {
  let component: InOfferingsComponent;
  let fixture: ComponentFixture<InOfferingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InOfferingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
