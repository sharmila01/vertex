import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InRankingComponent } from './in-ranking.component';

describe('InRankingComponent', () => {
  let component: InRankingComponent;
  let fixture: ComponentFixture<InRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
