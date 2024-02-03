import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybankingComponent } from './mybanking.component';

describe('MybankingComponent', () => {
  let component: MybankingComponent;
  let fixture: ComponentFixture<MybankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
