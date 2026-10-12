import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Noticias } from './pages/noticias/noticias';
import { Favoritos } from './pages/favoritos/favoritos';
import { Contacto } from './pages/contacto/contacto';
import { DetalleNoticia } from './pages/detalle-noticia/detalle-noticia'; 

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'noticias', component: Noticias },
  { path: 'favoritos', component: Favoritos },
  { path: 'contacto', component: Contacto },
  { path: 'noticia/:id', component: DetalleNoticia }
];

