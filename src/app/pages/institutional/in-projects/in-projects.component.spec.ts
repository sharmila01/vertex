import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InProjectsComponent } from './in-projects.component';

describe('InProjectsComponent', () => {
  let component: InProjectsComponent;
  let fixture: ComponentFixture<InProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
