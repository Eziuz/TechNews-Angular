import { Component, Input } from '@angular/core';
import { Noticia } from '../../models/noticia';

@Component({
  imports: [],
  selector: 'app-news-card',
  styleUrl: './news-card.css',
  templateUrl: './news-card.html',
})
export class NewsCard {
  @Input({ required: true }) noticia!: Noticia;
}
