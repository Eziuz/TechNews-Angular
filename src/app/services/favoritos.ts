import { Service, signal } from '@angular/core';

@Service()
export class FavoritosService {

    private readonly claveStorage = 'favoritos';

    favoritos = signal<number[]>(
        this.cargarFavoritos()
    );

    private cargarFavoritos(): number[] {

    const datos =
      localStorage.getItem(
        this.claveStorage
      );


    if (!datos) {
      return [];
    }

    try {
        return JSON.parse(datos)
      .map(Number);
    }
    catch {
      return [];
    }

  }

  esFavorito(id: number): boolean {
    return this.favoritos().includes(id);
  }

   toggleFavorito(id: number): void {

    const favoritosActuales =
      this.favoritos();


    let nuevosFavoritos: number[];


    if (
      favoritosActuales.includes(id)
    ) {

      nuevosFavoritos =
        favoritosActuales.filter(
          idFavorito =>
            idFavorito !== id
        );

    } else {

      nuevosFavoritos = [
        ...favoritosActuales,
        id
      ];

    }


    this.favoritos.set(
      nuevosFavoritos
    );


    this.guardarFavoritos();

  }


  private guardarFavoritos(): void {

    localStorage.setItem(
      this.claveStorage,
      JSON.stringify(
        this.favoritos()
      )
    );

  }

}
