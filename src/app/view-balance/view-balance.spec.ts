import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBalance } from './view-balance';

describe('ViewBalance', () => {
  let component: ViewBalance;
  let fixture: ComponentFixture<ViewBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBalance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBalance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
