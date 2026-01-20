import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccount } from './view-account';

describe('ViewAccount', () => {
  let component: ViewAccount;
  let fixture: ComponentFixture<ViewAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
