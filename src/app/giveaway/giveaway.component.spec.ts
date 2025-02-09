import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GiveawayComponent } from './giveaway.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GiveawayComponent', () => {
  let component: GiveawayComponent;
  let fixture: ComponentFixture<GiveawayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [GiveawayComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
