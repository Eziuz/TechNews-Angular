import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router'
import { NewsCard } from '../../components/news-card/news-card';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias';

@Component({
  imports: [NewsCard, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home  implements OnInit{

  noticiasDestacadas = signal<Noticia[]>([]);

  mensajeSuscripcion = signal('');

  private noticiasService = inject(NoticiasService);

  ngOnInit(): void {
    this.noticiasService.obtenerNoticias().subscribe({
      next: (noticias) => {
        console.log('Noticias obtenidas:', noticias);
        const destacadas = noticias.filter(noticia => noticia.destacada === true);
        console.log('Noticias destacadas:', destacadas);
        this.noticiasDestacadas.set(destacadas);
      },
      error: (error) => {
        console.error('Error al obtener noticias:', error);
      }

    });
  }
  suscribirse(
    evento: SubmitEvent,
    correo: string
  ): void {

    evento.preventDefault();


    if (!correo.trim()) {
      return;
    }


    this.mensajeSuscripcion.set(
      '¡Gracias por suscribirte a TechNews!'
    );

  }

}
