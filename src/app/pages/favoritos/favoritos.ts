import { Component, OnInit, computed, inject, signal} from '@angular/core';
import { NewsCard } from '../../components/news-card/news-card';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias';
import { FavoritosService } from '../../services/favoritos';

@Component({
  imports: [NewsCard],
  selector: 'app-favoritos',
  styleUrl: './favoritos.css',
  templateUrl: './favoritos.html',
})

export class Favoritos implements OnInit {

   todasLasNoticias =
    signal<Noticia[]>([]);


  private noticiasService =
    inject(NoticiasService);


  private favoritosService =
    inject(FavoritosService);


  noticiasFavoritas =
    computed(() => {

      return this.todasLasNoticias()
        .filter(
          noticia =>
            this.favoritosService
              .esFavorito(
                noticia.id
              )
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
            'Error al cargar las noticias favoritas:',
            error
          );

        }

      });
  }
}
