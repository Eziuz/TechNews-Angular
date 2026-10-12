import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NewsCard } from '../../components/news-card/news-card';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias';


@Component({
  imports: [NewsCard],
  selector: 'app-noticias',
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})

export class Noticias implements OnInit {


  todasLasNoticias = signal<Noticia[]>([]);

  textoBusqueda = signal('');

  categoriaSeleccionada = signal('Todas');

  paginaActual = signal(1);

  readonly noticiasPorPagina = 6;

  readonly categorias = ['Todas','Tecnologia','Educacion','Ciencia','Tendencias'];

  private noticiasService = inject(NoticiasService);

  noticiasFiltradas = computed(() => {

    const busqueda =
      this.textoBusqueda()
        .toLowerCase()
        .trim();


    const categoria =
      this.categoriaSeleccionada();


    return this.todasLasNoticias()
      .filter(noticia => {

        const coincideBusqueda =

          noticia.titulo
            .toLowerCase()
            .includes(busqueda)

          ||

          noticia.categoria
            .toLowerCase()
            .includes(busqueda)

          ||

          noticia.descripcion
            .toLowerCase()
            .includes(busqueda);


        const coincideCategoria =

          categoria === 'Todas'

          ||

          noticia.categoria === categoria;


        return (
          coincideBusqueda &&
          coincideCategoria
        );

      });

  });


  totalPaginas = computed(() => {

    return Math.ceil(
      this.noticiasFiltradas().length /
      this.noticiasPorPagina
    );

  });


  paginas = computed(() => {

    return Array.from(
      {
        length: this.totalPaginas()
      },
      (_, indice) =>
        indice + 1
    );

  });


  noticiasPagina = computed(() => {

    const inicio =

      (this.paginaActual() - 1) *
      this.noticiasPorPagina;


    const fin =

      inicio +
      this.noticiasPorPagina;


    return this.noticiasFiltradas()
      .slice(
        inicio,
        fin
      );

  });


  ngOnInit(): void {

    this.noticiasService
      .obtenerNoticias()
      .subscribe({

        next: noticias => {

          this.todasLasNoticias.set(
            noticias
          );

        },

        error: error => {

          console.error(
            'Error al cargar las noticias:',
            error
          );

        }

      });

  }


  actualizarBusqueda(
    texto: string
  ): void {

    this.textoBusqueda.set(
      texto
    );

    this.paginaActual.set(1);

  }


  seleccionarCategoria(
    categoria: string
  ): void {

    this.categoriaSeleccionada.set(
      categoria
    );

    this.paginaActual.set(1);

  }


  irAPagina(
    pagina: number
  ): void {

    if (
      pagina < 1 ||
      pagina > this.totalPaginas()
    ) {
      return;
    }


    this.paginaActual.set(
      pagina
    );

  }


  paginaAnterior(): void {

    this.irAPagina(
      this.paginaActual() - 1
    );

  }


  paginaSiguiente(): void {

    this.irAPagina(
      this.paginaActual() + 1
    );

  }

}