import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Noticia } from '../models/noticia';


@Injectable({
    providedIn: 'root'
})
export class NoticiasService {

    private http =
    inject(HttpClient);


  private readonly url =
    'data/noticias_30_detalle.json';


  private readonly claveStorage =
    'technews-noticias';


  obtenerNoticias():
    Observable<Noticia[]> {

    const noticiasGuardadas =
      this.leerNoticiasLocal();


    if (noticiasGuardadas) {

      return of(
        noticiasGuardadas
      );

    }


    return this.http
      .get<Noticia[]>(this.url)
      .pipe(

        tap(noticias => {

          this.guardarNoticias(
            noticias
          );

        })

      );

  }


  private leerNoticiasLocal():
    Noticia[] | null {

    const datos =
      localStorage.getItem(
        this.claveStorage
      );


    if (!datos) {
      return null;
    }


    try {

      return JSON.parse(datos);

    } catch {

      return null;

    }

  }


  private guardarNoticias(
    noticias: Noticia[]
  ): void {

    localStorage.setItem(

      this.claveStorage,

      JSON.stringify(
        noticias
      )

    );

  }

    crearNoticia(
    datos: Omit<Noticia, 'id'>
    ): Noticia {

    const noticias =
        this.leerNoticiasLocal() ?? [];


    const siguienteId =
        noticias.length > 0

        ? Math.max(
            ...noticias.map(
                noticia => noticia.id
            )
            ) + 1

        : 1;


    const nuevaNoticia: Noticia = {

        id: siguienteId,

        ...datos

    };


    const noticiasActualizadas = [
        ...noticias,
        nuevaNoticia
    ];


    this.guardarNoticias(
        noticiasActualizadas
    );


    return nuevaNoticia;
    }

    actualizarNoticia(
    id: number,
    datos: Omit<Noticia, 'id'>
  ): Noticia | null {

    const noticias =
      this.leerNoticiasLocal() ?? [];


    const indice =
      noticias.findIndex(
        noticia => noticia.id === id
      );


    if (indice === -1) {
      return null;
    }


    const noticiaActualizada: Noticia = {
      id,
      ...datos
    };


    const noticiasActualizadas = [
      ...noticias
    ];


    noticiasActualizadas[indice] =
      noticiaActualizada;


    this.guardarNoticias(
      noticiasActualizadas
    );


    return noticiaActualizada;
  }

  eliminarNoticia(
      id: number
    ): boolean {

      const noticias =
        this.leerNoticiasLocal() ?? [];


      const existe =
        noticias.some(
          noticia =>
            noticia.id === id
        );


      if (!existe) {

        return false;

      }


      const noticiasActualizadas =
        noticias.filter(
          noticia =>
            noticia.id !== id
        );


      this.guardarNoticias(
        noticiasActualizadas
      );


      return true;

    }
}
