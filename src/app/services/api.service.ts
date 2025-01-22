import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ruta, Orden } from '../interfaces/route.interface'
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3011/rutas'; // Ajusta la URL base según tu configuración

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
      return this.http.get<Ruta[]>(this.baseUrl);
  }

  getRuta(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.baseUrl}/${id}`);
  }

  crearRuta(ruta: Ruta): Observable<Ruta> {
      return this.http.post<Ruta>(this.baseUrl, ruta);
  }

}
