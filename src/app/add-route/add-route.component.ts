import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ruta } from '../interfaces/route.interface'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import csv from 'csvtojson';


@Component({
  selector: 'app-add-route',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  readonly dialogRef = inject(MatDialogRef<AddRouteComponent>);
  readonly data = inject<Ruta>(MAT_DIALOG_DATA);
  readonly route = this.data;

  drivers: any[] = [];
  selectedDriver: any;

  constructor(private http: HttpClient){
    this.cargarConductores();
  }

  async cargarConductores() {
    try {
      const csvData = await this.http.get('assets/drivers.csv', { responseType: 'text' }).toPromise();
      const jsonData = await csv().fromString(csvData || '');
      this.drivers = jsonData
        .map((item: any) => ({
            value: item.ID,
            label: item.NAME
          }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    } catch (error) {
      console.error('Error en la carga de datos CSV. ', error);
    }
  }

}
