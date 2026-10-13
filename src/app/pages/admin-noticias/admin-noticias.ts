import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-admin-noticias',
  styleUrl: './admin-noticias.css',
  templateUrl: './admin-noticias.html',
})

export class AdminNoticias implements OnInit {

  /*
   * Noticias cargadas.
   */
  noticias =
    signal<Noticia[]>([]);


  /*
   * Abre o cierra el formulario.
   */
  mostrarFormulario =
    signal(false);


  /*
   * Mensajes de confirmación.
   */
  mensajeExito =
    signal('');


  /*
   * Determina si estamos creando
   * o editando una noticia.
   */
  modoFormulario =
    signal<'crear' | 'editar'>('crear');


  /*
   * ID de la noticia que estamos editando.
   *
   * null significa que no estamos
   * editando ninguna.
   */
  idNoticiaEditando =
    signal<number | null>(null);


  /*
   * Genera automáticamente las rutas
   * únicas de las imágenes existentes.
   */
  rutasImagenes =
    computed(() => {

      const rutas =
        this.noticias()
          .map(
            noticia =>
              noticia.imagen
          )
          .filter(
            ruta =>
              ruta.trim() !== ''
          );


      return [
        ...new Set(rutas)
      ];

    });


  private noticiasService =
    inject(NoticiasService);


  private formBuilder =
    inject(FormBuilder);


  /*
   * Formulario utilizado tanto
   * para CREATE como para UPDATE.
   */
  formularioNoticia =
    this.formBuilder.nonNullable.group({

      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],


      categoria: [
        '',
        Validators.required
      ],


      imagen: [
        '',
        Validators.required
      ],


      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],


      fecha: [
        '',
        Validators.required
      ],


      destacada: [
        false
      ],


      autor: [
        '',
        Validators.required
      ],


      subtitulo: [
        '',
        Validators.required
      ],


      contenidoTexto: [
        '',
        [
          Validators.required,
          Validators.minLength(20)
        ]
      ]

    });


  ngOnInit(): void {

    this.cargarNoticias();

  }


  /*
   * READ
   */
  cargarNoticias(): void {

    this.noticiasService
      .obtenerNoticias()
      .subscribe({

        next: noticias => {

          this.noticias.set(
            noticias
          );

        },


        error: error => {

          console.error(
            'Error al cargar noticias:',
            error
          );

        }

      });

  }


  /*
   * Abre formulario en modo CREATE.
   */
  abrirFormulario(): void {

    this.mensajeExito.set('');

    this.modoFormulario.set(
      'crear'
    );

    this.idNoticiaEditando.set(
      null
    );

    this.limpiarFormulario();

    this.mostrarFormulario.set(
      true
    );

  }


  /*
   * Abre formulario en modo UPDATE.
   */
  editarNoticia(
    noticia: Noticia
  ): void {

      console.log(
    'Noticia seleccionada:',
    noticia
  );

  console.log(
    'Contenido:',
    noticia.contenido
  );

    this.mensajeExito.set('');

    this.modoFormulario.set(
      'editar'
    );

    this.idNoticiaEditando.set(
      noticia.id
    );


    this.formularioNoticia.patchValue({

      titulo:
        noticia.titulo,

      categoria:
        noticia.categoria,

      imagen:
        noticia.imagen,

      descripcion:
        noticia.descripcion,

      fecha:
        noticia.fecha,

      destacada:
        noticia.destacada,

      autor:
        noticia.autor,

      subtitulo:
        noticia.contenido[0]
          ?.subtitulo ?? '',

      contenidoTexto:
        noticia.contenido[0]
          ?.texto ?? ''

    });


    this.mostrarFormulario.set(
      true
    );


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  /*
   * Método utilizado por ngSubmit.
   *
   * Decide si crear o actualizar.
   */
  guardarNoticia(): void {

    if (
      this.formularioNoticia.invalid
    ) {

      this.formularioNoticia
        .markAllAsTouched();

      return;

    }


    if (
      this.modoFormulario()
      === 'editar'
    ) {

      this.actualizarNoticia();

    } else {

      this.crearNoticia();

    }

  }


  /*
   * CREATE
   */
  private crearNoticia(): void {

    const datos =
      this.formularioNoticia
        .getRawValue();


    const nuevaNoticia =
      this.noticiasService
        .crearNoticia({

          titulo:
            datos.titulo,

          categoria:
            datos.categoria,

          imagen:
            datos.imagen,

          descripcion:
            datos.descripcion,

          fecha:
            datos.fecha,

          destacada:
            datos.destacada,

          autor:
            datos.autor,

          contenido: [
            {

              subtitulo:
                datos.subtitulo,

              texto:
                datos.contenidoTexto

            }
          ]

        });


    this.noticias.update(
      noticias => [

        ...noticias,

        nuevaNoticia

      ]
    );


    this.cerrarFormulario();


    this.mensajeExito.set(
      'Noticia creada correctamente.'
    );

  }


  /*
   * UPDATE
   */
  private actualizarNoticia(): void {

    const id =
      this.idNoticiaEditando();


    if (id === null) {

      return;

    }


    const datos =
      this.formularioNoticia
        .getRawValue();


    /*
     * Buscamos la noticia original
     * para conservar las secciones
     * adicionales de contenido.
     */
    const noticiaOriginal =
      this.noticias()
        .find(
          noticia =>
            noticia.id === id
        );


    const contenidoRestante =
      noticiaOriginal
        ?.contenido
        .slice(1) ?? [];


    const noticiaActualizada =
      this.noticiasService
        .actualizarNoticia(
          id,
          {

            titulo:
              datos.titulo,

            categoria:
              datos.categoria,

            imagen:
              datos.imagen,

            descripcion:
              datos.descripcion,

            fecha:
              datos.fecha,

            destacada:
              datos.destacada,

            autor:
              datos.autor,

            contenido: [

              {

                subtitulo:
                  datos.subtitulo,

                texto:
                  datos.contenidoTexto

              },

              ...contenidoRestante

            ]

          }
        );


    if (!noticiaActualizada) {

      console.error(
        'No se encontró la noticia que se intenta actualizar.'
      );

      return;

    }


    /*
     * Actualizamos la tabla inmediatamente.
     */
    this.noticias.update(
      noticias =>

        noticias.map(
          noticia =>

            noticia.id ===
              noticiaActualizada.id

              ? noticiaActualizada

              : noticia
        )

    );


    this.cerrarFormulario();


    this.mensajeExito.set(
      'Noticia actualizada correctamente.'
    );

  }

  eliminarNoticia(
    noticia: Noticia
  ): void {

    const confirmar =
      window.confirm(
        `¿Estás seguro de que deseas eliminar la noticia "${noticia.titulo}"?`
      );


    if (!confirmar) {

      return;

    }


    const eliminada =
      this.noticiasService
        .eliminarNoticia(
          noticia.id
        );


    if (!eliminada) {

      console.error(
        'No se encontró la noticia que se intenta eliminar.'
      );

      return;

    }


    this.noticias.update(
      noticias =>

        noticias.filter(
          noticiaActual =>
            noticiaActual.id !== noticia.id
        )

    );


    /*
    * Si estábamos editando justamente
    * la noticia eliminada, cerramos
    * el formulario.
    */
    if (
      this.idNoticiaEditando()
      === noticia.id
    ) {

      this.cerrarFormulario();

    }


    this.mensajeExito.set(
      'Noticia eliminada correctamente.'
    );

}


  /*
   * Cierra el formulario.
   *
   * IMPORTANTE:
   * Solo debe existir una implementación
   * de este método.
   */
  cerrarFormulario(): void {

    this.mostrarFormulario.set(
      false
    );

    this.modoFormulario.set(
      'crear'
    );

    this.idNoticiaEditando.set(
      null
    );

    this.limpiarFormulario();

  }


  /*
   * Limpia todos los campos.
   */
  private limpiarFormulario(): void {

    this.formularioNoticia.reset({

      titulo: '',

      categoria: '',

      imagen: '',

      descripcion: '',

      fecha: '',

      destacada: false,

      autor: '',

      subtitulo: '',

      contenidoTexto: ''

    });

  }

}
