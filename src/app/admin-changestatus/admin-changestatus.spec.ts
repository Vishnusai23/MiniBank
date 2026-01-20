import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChangestatus } from './admin-changestatus';

describe('AdminChangestatus', () => {
  let component: AdminChangestatus;
  let fixture: ComponentFixture<AdminChangestatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChangestatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChangestatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
