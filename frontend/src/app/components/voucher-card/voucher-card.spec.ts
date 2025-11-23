import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherCard } from './voucher-card';

describe('VoucherCard', () => {
  let component: VoucherCard;
  let fixture: ComponentFixture<VoucherCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
