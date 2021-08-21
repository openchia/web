import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutComponent } from './payout.component';

describe('PayoutComponent', () => {
  let component: PayoutComponent;
  let fixture: ComponentFixture<PayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
