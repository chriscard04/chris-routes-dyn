import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError, EMPTY } from 'rxjs';
import { Ruta, Orden, Route } from '../interfaces/route.interface'
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3011/rutas';
  private baseExtUrl = 'http://localhost:3000/routes';

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
      return this.http.get<Ruta[]>(this.baseUrl);
  }

  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.baseUrl}/${id}`)
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
    return this.http.post<Ruta>(this.baseUrl, ruta);
  }

  getRoutes(): Observable<Route[]> {
      return this.http.get<Route[]>(this.baseExtUrl);
  }

  getRoute(id: number): Observable<Route | null> {
    return this.http.get<Route>(`${this.baseExtUrl}/${id}`)
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
