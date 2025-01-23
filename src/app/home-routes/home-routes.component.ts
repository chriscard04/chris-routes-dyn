import { Component, AfterViewInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AddRouteComponent } from '../add-route/add-route.component'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Ruta, Orden } from '../interfaces/route.interface'
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service'
import { DriversService } from '../services/drivers.service'



@Component({
  selector: 'app-home-routes',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginator,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './home-routes.component.html',
  styleUrl: './home-routes.component.scss',
  providers: [ApiService, DriversService]
})
export class HomeRoutesComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly dialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private driversService = inject(DriversService);


  displayedColumns: string[] = ['Ruta', 'Conductor', 'Fecha Entrega', 'Acciones'];
  dataSource = new MatTableDataSource<Ruta>([]);


  columns = [
    { prop: 'Ruta' },
    { name: 'Conductor' },
    { name: 'Fecha Entrega' },
    { name: 'Ordenes Entrega' },
    { name: 'Notas' }
  ];

  constructor(){
    this.getRutas();
  }


  ngAfterViewInit() {

  }

  getRutas() {
    this.apiService.getRutas().subscribe(async (rutas: Ruta[]) => {
      for (const ruta of rutas) {
        ruta.conductorName = await this.getConductorName(ruta.conductor.toString())
      }
      this.dataSource = new MatTableDataSource<Ruta>(rutas);
      this.dataSource.paginator = this.paginator;
      },

      error => {
        console.error('Error al obtener rutas:', error);
      }
      );
  }

  async getConductorName(id: string): Promise<string | ''> {
    const name = await this.driversService.getConductor(id);
    if (name) {
      return Promise.resolve(name);
    } else {
      return Promise.resolve('');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openRoute(route: Ruta) {
    const dialogRef = this.dialog.open(AddRouteComponent, {
      data: route,
      height: '800px',
      width: '700px',
    });

    dialogRef.componentInstance.isEditRoute = true;
  }

  newRoute() {
    const dialogRef = this.dialog.open(AddRouteComponent, {
      data: null,
      height: '800px',
      width: '700px',
    });

    dialogRef.componentInstance.isEditRoute = false;
  }

}
