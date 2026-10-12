import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-noticia',
  styleUrl: './detalle-noticia.css',
  templateUrl: './detalle-noticia.html',
})
export class DetalleNoticia implements OnInit {

    todasLasNoticias =
    signal<Noticia[]>([]);


  noticiaSeleccionada =
    signal<Noticia | null>(null);


  private route =
    inject(ActivatedRoute);


  private noticiasService =
    inject(NoticiasService);


  noticiasRelacionadas =
    computed(() => {

      const seleccionada =
        this.noticiaSeleccionada();


      if (!seleccionada) {
        return [];
      }


      return this.todasLasNoticias()
        .filter(
          noticia =>

            noticia.categoria ===
              seleccionada.categoria

            &&

            noticia.id !==
              seleccionada.id
        )
        .slice(0, 3);

    });


  ngOnInit(): void {

    this.noticiasService
      .obtenerNoticias()
      .subscribe({

        next: noticias => {

          this.todasLasNoticias.set(
            noticias
          );


          this.route.paramMap
            .subscribe(parametros => {

              const id =
                Number(
                  parametros.get('id')
                );


              const noticia =
                noticias.find(
                  noticia =>
                    noticia.id === id
                ) ?? null;


              this.noticiaSeleccionada
                .set(noticia);
              
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
                

            });

        },

        error: error => {

          console.error(
            'Error al cargar la noticia:',
            error
          );

        }

      });

  }

}
