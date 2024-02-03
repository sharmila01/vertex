import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InViewOrderComponent } from './in-view-order.component';

describe('InViewOrderComponent', () => {
  let component: InViewOrderComponent;
  let fixture: ComponentFixture<InViewOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InViewOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
