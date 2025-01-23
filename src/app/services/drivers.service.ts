import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Conductor } from '../interfaces/route.interface'
import csvtojson from 'csvtojson';


@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private drivers: Conductor[] = [];

  constructor(private http: HttpClient) {
  }

  private async cargarConductores(): Promise<void> {
    try {
      const csvData = await this.http.get('assets/drivers.csv', { responseType: 'text' }).toPromise();
      this.drivers = await csvtojson().fromString(csvData || '');
    } catch (error) {
      console.error('Error al cargar datos CSV. ', error);
    }
  }

  async getConductores(): Promise<Conductor[]> {
    try {
      if (this.drivers.length === 0) {
        await this.cargarConductores()
      }
      return Promise.resolve(this.drivers);
    } catch (error) {
      console.error('Error al cargar datos CSV. ', error);
      return Promise.resolve([]);
    }
  }

  async getConductor(id: number): Promise<string | null > {
    try {
      if (this.drivers.length === 0) {
        await this.cargarConductores();
      }

      const conductor = this.drivers.find(cond => cond.ID === id.toString());
      return conductor ? conductor.NAME : null;
    } catch (error) {
      console.error('Error al obtener nombre del conductor. ', error);
      return null;
    }
  }

  async getConductorData(id: string = ''): Promise<Conductor> {
    try {
      if (this.drivers.length === 0) {
        await this.cargarConductores();
      }

      const conductor = this.drivers.find(cond => cond.ID === id);
      return conductor ? conductor : {ID: '0', NAME: ''};
    } catch (error) {
      console.error('Error al obtener nombre del conductor. ', error);
      return {ID: '0', NAME: ''};
    }
  }

}
