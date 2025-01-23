import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ruta, Conductor, Orden, Route } from '../interfaces/route.interface'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../services/drivers.service'
import { ApiService } from '../services/api.service'
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-route',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginator,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss',
  providers: [
    DriversService,
    ApiService,
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'es-PA' },
  ]
})
export class AddRouteComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialogRef = inject(MatDialogRef<AddRouteComponent>);
  readonly data = inject<Ruta>(MAT_DIALOG_DATA);
  route = this.data;
  driversService = inject(DriversService);
  apiService = inject(ApiService);
  private _snackBar = inject(MatSnackBar);

  conductores: Conductor[] = [];
  conductorSeleccionado: Conductor = {ID: '0', NAME: ''};
  routeForm: FormGroup = new FormGroup({
    id_ruta: new FormControl(''),
    conductor: new FormControl(null),
    fecha_entrega: new FormControl(''),
    notas: new FormControl('')
  });

  displayedColumns: string[] = ['secuencia', 'id_orden', 'valor', 'prioritario'];
  dataSource = new MatTableDataSource<Orden>([]);

  columns = [
    { prop: 'secuencia' },
    { name: 'id_orden' },
    { name: 'valor' },
    { name: 'prioritario' },
  ];


  public isEditRoute: boolean = false;
  readyToAdd: boolean = false;
  busquedaRuta: string = '';

  constructor() {}

  ngOnInit() {
    this.driversService.getConductores().then((conductores: Conductor[]) => {
      this.conductores = conductores;
      this.isEditRoute ? this.cargarConductor() : false;
    });
  }

  // Cuando es Editar, se carga el conductor
  private async cargarConductor() {
    const id = this.route.conductor.toString();
    if (id) {
      this.conductorSeleccionado = await this.driversService.getConductorData(id);
    } else {
      this.conductorSeleccionado = { ID: '0', NAME: '' };
    }

    this.routeForm.patchValue({
      id_ruta: this.route.id_ruta,
      conductor: this.conductorSeleccionado,
      fecha_entrega: this.route.fecha_entrega,
      notas: this.route.notas
    });
    this.dataSource = new MatTableDataSource<Orden>(this.route.ordenes);
    this.dataSource.paginator = this.paginator;
  }

  findRutaExt(value: string) {
    // Almacena las ordenes precargadas
    let tempOrders : Orden[] = [];

    // Se verifica si existe la ruta en el sistema
    this.apiService.getRuta(parseInt(value)).subscribe({
      next: (ruta: Ruta) => {

        // Handle the successful response
        console.log('Data received:', ruta);
        this.route = ruta;
        this.cargarConductor();
        this.isEditRoute = true;
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


    // Se consulta en el servicio externo si existe la ruta.
    if (!this.isEditRoute) {
      this.apiService.getRoute(parseInt(value)).subscribe({
        next: async (route: Route | null) => {
          // Handle the successful response
          console.log('Data received:', route);
          this.conductorSeleccionado = await this.driversService.getConductorData(route?.driverId.toString());
          this.route.id_ruta = route?.id ? parseInt(route.id) : 0;

          this.routeForm.patchValue({
            id_ruta: route?.id,
            conductor: this.conductorSeleccionado,
            fecha_entrega: route?.date,
            notas: route?.notes
          });

          // Siempre y cuando se reciba una ruta, se habilita para agregarla / editarla
          route?.id ? this.readyToAdd = true : this.readyToAdd = false;
          if (route && route.orders) {
            for (const order of route.orders) {
              tempOrders.push({
                id_orden: order.id,
                valor: order.value,
                secuencia: order.sequence,
                prioritario: order.priority
              });
            }
          }
          this.dataSource = new MatTableDataSource<Orden>(tempOrders);
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.log('An error occurred:', err);
          // Handle the error
        },
        complete: () => {
          console.log('Request completed.');

         /*  if (!this.isEditRoute && !this.readyToAdd) {
            this._snackBar.open('Upss la ruta no existe', 'No podemos continuar',{
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } */
        }
        }
      );
    }

  }

}
