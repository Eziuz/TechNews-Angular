import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleNoticia } from './detalle-noticia';

describe('DetalleNoticia', () => {
  let component: DetalleNoticia;
  let fixture: ComponentFixture<DetalleNoticia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleNoticia],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleNoticia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
