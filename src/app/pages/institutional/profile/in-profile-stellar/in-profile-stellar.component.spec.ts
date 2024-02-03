import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProfileStellarComponent } from './in-profile-stellar.component';

describe('InProfileStellarComponent', () => {
  let component: InProfileStellarComponent;
  let fixture: ComponentFixture<InProfileStellarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProfileStellarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProfileStellarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
