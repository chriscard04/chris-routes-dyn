import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';


interface Ruta {
  id_ruta: number;
  conductor: string;
  fecha_entrega: string;
  ordenes_entrega: number;
  notas: string;
}


@Component({
  selector: 'app-home-routes',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatPaginator,
  ],
  templateUrl: './home-routes.component.html',
  styleUrl: './home-routes.component.scss'
})
export class HomeRoutesComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Use ViewChild

  rutas: Ruta[] = [
    { id_ruta: 1, conductor: 'John Doe', fecha_entrega: '2024-11-20', ordenes_entrega: 10, notas: 'On time delivery' },
    { id_ruta: 2, conductor: 'Jane Smith', fecha_entrega: '2024-11-21', ordenes_entrega: 8, notas: 'Slight delay' },
    { id_ruta: 3, conductor: 'Michael Johnson', fecha_entrega: '2024-11-22', ordenes_entrega: 12, notas: 'Heavy traffic' },
    { id_ruta: 4, conductor: 'Emily Davis', fecha_entrega: '2024-11-23', ordenes_entrega: 5, notas: 'Early delivery' },
    { id_ruta: 5, conductor: 'David Lee', fecha_entrega: '2024-11-24', ordenes_entrega: 15, notas: 'Multiple stops' },
    { id_ruta: 6,  conductor: 'Olivia Brown', fecha_entrega: '2024-11-25', ordenes_entrega: 7, notas: 'Weather delay' },
    { id_ruta: 7, conductor: 'William Wilson', fecha_entrega: '2024-11-26', ordenes_entrega: 11, notas: 'On time delivery' },
    { id_ruta: 8, conductor: 'Sophia Taylor', fecha_entrega: '2024-11-27', ordenes_entrega: 9, notas: 'Slight detour' },
    { id_ruta: 9, conductor:  'James Anderson', fecha_entrega: '2024-11-28', ordenes_entrega: 13, notas: 'Traffic accident' },
    { id_ruta: 10, conductor: 'Ava Martinez', fecha_entrega: '2024-11-29', ordenes_entrega: 6, notas: 'Early delivery' },
    { id_ruta: 11, conductor: 'Benjamin Thomas', fecha_entrega: '2024-11-30', ordenes_entrega: 14, notas: 'Multiple stops' },
    { id_ruta: 12, conductor: 'Charlotte White', fecha_entrega: '2024-12-01', ordenes_entrega: 10, notas: 'On time delivery' }
  ];

  displayedColumns: string[] = ['Ruta', 'Conductor', 'Fecha Entrega', 'Ordenes Entrega', 'Notas', 'Acciones'];
  dataSource = new MatTableDataSource<Ruta>(this.rutas);


  columns = [
    { prop: 'Ruta' },
    { name: 'Conductor' },
    { name: 'Fecha Entrega' },
    { name: 'Ordenes Entrega' },
    { name: 'Notas' }
  ];


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
