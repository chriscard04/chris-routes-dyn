import { Component, AfterViewInit, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
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
import { ApiService } from '../api.service'



@Component({
  selector: 'app-home-routes',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatPaginator,
    HttpClientModule
  ],
  templateUrl: './home-routes.component.html',
  styleUrl: './home-routes.component.scss',
  providers: [ApiService]
})
export class HomeRoutesComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly dialog = inject(MatDialog);
  private apiService = inject(ApiService);


  displayedColumns: string[] = ['Ruta', 'Conductor', 'Fecha Entrega', 'Notas', 'Acciones'];
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
    this.dataSource.paginator = this.paginator;
  }

  getRutas() {
    this.apiService.getRutas().subscribe((rutas: Ruta[]) => {
      console.log(rutas)
      this.dataSource = new MatTableDataSource<Ruta>(rutas);
      },

      error => {
        console.error('Error al obtener rutas:', error);
      }
      );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openRoute(route: Ruta) {
    console.log(route);

    const dialogRef = this.dialog.open(AddRouteComponent, {
      data: route,
      height: '400px',
      width: '600px',
    });

  }

}
