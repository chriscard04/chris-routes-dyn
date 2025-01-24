import { Component, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
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
import { ConfirmDialogComponent } from '../confirmation/confirmation.component';



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

  isToastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  @ViewChild('toastContainer', { static: true }) toastContainer!: ElementRef;

  constructor(){
    this.getRutas();
  }


  ngAfterViewInit() {

  }

  getRutas() {
    this.apiService.getRutas().subscribe(async (rutas: Ruta[]) => {
      for (const ruta of rutas) {
        ruta.conductorName = await this.getConductorName(ruta.conductor)
      }
      this.dataSource = new MatTableDataSource<Ruta>(rutas);
      this.dataSource.paginator = this.paginator;
      },

      error => {
        console.error('Error al obtener rutas:', error);
      }
      );
  }

  async getConductorName(id: number): Promise<string | ''> {
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
      height: '750px',
      width: '700px',
      hasBackdrop: true,
      disableClose: true,
    });

    dialogRef.componentInstance.isEditRoute = true;

    dialogRef.afterClosed().subscribe(result => {
      if(result !== false){
        console.log(result);
        this.showToast(result.message, result.type)
        this.getRutas();
      }
    });
  }

  newRoute() {
    const dialogRef = this.dialog.open(AddRouteComponent, {
      data: null,
      height: '800px',
      width: '700px',
    });

    dialogRef.componentInstance.isEditRoute = false;

    dialogRef.afterClosed().subscribe(result => {
      if(result !== false){
        console.log(result);
        this.showToast(result.message, result.type);
        this.getRutas();
      }
    });
  }


  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.isToastVisible = true;
    this.toastType = type;

    setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    this.isToastVisible = false;
  }



  deleteRoute(id: number) {
    // ConfirmDialogComponent
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Está seguro de eliminar la ruta ${id}?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.eliminarRuta(id).subscribe({
          next: (response: any) => {
            if (response.message === 'success') {
              this.showToast(`Se ha eliminado correctamente la Ruta #${id} y sus ordenes.`, 'error');
              this.getRutas();
            }
          },
          error: (err) => {
            console.log('An error occurred:', err);
            // Handle the error
          },
          complete: () => {
            console.log('Request completed.');
          }
          }
        );
      }
    });
  }
}
