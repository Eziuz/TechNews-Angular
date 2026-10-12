import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from '../models/noticia';


@Injectable({
    providedIn: 'root'
})
export class NoticiasService {

    private http = inject(HttpClient);

    private url = 'data/noticias_30_detalle.json';

    obtenerNoticias(): Observable<Noticia[]> {

        return this.http.get<Noticia[]>(this.url);
    }
}
