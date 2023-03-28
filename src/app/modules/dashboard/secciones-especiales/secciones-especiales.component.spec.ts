import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionesEspecialesComponent } from './secciones-especiales.component';

describe('SeccionesEspecialesComponent', () => {
  let component: SeccionesEspecialesComponent;
  let fixture: ComponentFixture<SeccionesEspecialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeccionesEspecialesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SeccionesEspecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
