import { Component, Input, inject } from '@angular/core';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-news-card',
  styleUrl: './news-card.css',
  templateUrl: './news-card.html',
})
export class NewsCard {
  
  @Input({ required: true }) noticia!: Noticia;

  private favoritosService = inject(FavoritosService);

  esFavorito(): boolean {

    return this.favoritosService.esFavorito(this.noticia.id);
  
  }

  toggleFavorito(): void {

    this.favoritosService.toggleFavorito(this.noticia.id);

  }
}
