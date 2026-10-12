export interface SeccionContenido {
    subtitulo: string;
    texto: string;
}



export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  imagen: string;
  descripcion: string;
  fecha: string;
  destacada: boolean;
  autor: string;
  contenido: SeccionContenido[];

}