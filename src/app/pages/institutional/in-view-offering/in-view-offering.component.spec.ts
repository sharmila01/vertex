import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InViewOfferingComponent } from './in-view-offering.component';

describe('InViewOfferingComponent', () => {
  let component: InViewOfferingComponent;
  let fixture: ComponentFixture<InViewOfferingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InViewOfferingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InViewOfferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
