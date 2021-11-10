import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveawayComponent } from './giveaway.component';

describe('GiveawayComponent', () => {
  let component: GiveawayComponent;
  let fixture: ComponentFixture<GiveawayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveawayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
