import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError, EMPTY } from 'rxjs';
import { Ruta, Orden, Route } from '../interfaces/route.interface'
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3011';

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
      return this.http.get<Ruta[]>(`${this.baseUrl}/rutas`);
  }

  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.baseUrl}/rutas/${id}`)
      .pipe(
        catchError((error:any) => {
          if (error.status === 404) {
            console.log('Route not found:', error);
            // Handle the ERROR. Message

            return EMPTY;
          } else {
            console.error('An error occurred while fetching the route:', error);
            return throwError(() => new Error('Network error'));
          }
        })
      );
  }

  crearRuta(ruta: Ruta): Observable<Ruta> {
    return this.http.post<Ruta>(`${this.baseUrl}/rutas`, ruta).pipe(
      catchError((error:any) => {
          console.error('An error occurred while fetching the route:', error);
          return throwError(() => new Error('Network error'));
      })
    );
  }

  editarRuta(ruta: Ruta): Observable<any> {
    const url = `${this.baseUrl}/rutas/${ruta.id_ruta}`;
    return this.http.put<Ruta>(url, ruta).pipe(
      catchError((error: any) => {
        console.error('Error editing route:', error);
        return throwError(() => new Error('Error editing route'));
      })
    );
  }

  eliminarRuta(id: number): Observable<any> {
    const url = `${this.baseUrl}/rutas/${id}`;
    return this.http.delete(url).pipe(
      catchError((error: any) => {
        console.error('Error deleting route:', error);
        return throwError(() => new Error('Error deleting route'));
      })
    );
  }

  getRoute(id: number): Observable<Route | null> {
    return this.http.get<Route>(`${this.baseUrl}/extroute/${id}`)
      .pipe(
        catchError((error:any) => {
          if (error.status === 404) {
            console.log('Route not found:', error);
            // Handle the ERROR. Message

            return EMPTY;
          } else {
            console.error('An error occurred while fetching the route:', error);
            return throwError(() => new Error('Network error'));
          }
        })
      );
  }
}
