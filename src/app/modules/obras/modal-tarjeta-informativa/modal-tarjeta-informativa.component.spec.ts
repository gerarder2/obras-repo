import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTarjetaInformativaComponent } from './modal-tarjeta-informativa.component';

describe('ModalTarjetaInformativaComponent', () => {
  let component: ModalTarjetaInformativaComponent;
  let fixture: ComponentFixture<ModalTarjetaInformativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTarjetaInformativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTarjetaInformativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
