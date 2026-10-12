import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-contacto',
  styleUrl: './contacto.css',
  templateUrl: './contacto.html',
})
export class Contacto {

  private formBuilder =
    inject(FormBuilder);


  mensajeExito =
    signal('');


  formularioContacto =
    this.formBuilder.nonNullable.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],


      correo: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],


      asunto: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ],


      mensaje: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],


      aceptaTerminos: [
        false,
        Validators.requiredTrue
      ]

    });


  enviarFormulario(): void {

    this.mensajeExito.set('');


    if (
      this.formularioContacto.invalid
    ) {

      this.formularioContacto
        .markAllAsTouched();

      return;

    }


    console.log(
      'Datos enviados:',
      this.formularioContacto
        .getRawValue()
    );


    this.mensajeExito.set(
      '¡Gracias! Tu mensaje fue enviado correctamente.'
    );


    this.formularioContacto.reset({
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: '',
      aceptaTerminos: false
    });

  }
}
