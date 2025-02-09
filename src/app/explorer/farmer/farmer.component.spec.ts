import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FarmerComponent } from './farmer.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FarmerComponent', () => {
  let component: FarmerComponent;
  let fixture: ComponentFixture<FarmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [FarmerComponent],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
