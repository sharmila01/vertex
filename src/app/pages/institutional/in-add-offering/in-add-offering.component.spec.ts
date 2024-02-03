import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAddOfferingComponent } from './in-add-offering.component';

describe('InAddOfferingComponent', () => {
  let component: InAddOfferingComponent;
  let fixture: ComponentFixture<InAddOfferingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InAddOfferingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InAddOfferingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
