import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog, MatDialogModule
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
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirmation/confirmation.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';


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
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
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
  route = this.data || {
    id_ruta: 0,
    conductor: 0,
    fecha_entrega: '',
    notas: ''
  };
  driversService = inject(DriversService);
  apiService = inject(ApiService);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

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
  valorTotal: number = 0.00;

  constructor() {}

  ngOnInit() {
    this.driversService.getConductores().then((conductores: Conductor[]) => {
      this.conductores = conductores;
      this.isEditRoute ? this.cargarConductor() : false;
    });
  }

  // Cuando es Editar, se carga el conductor
  private async cargarConductor() {
    this.valorTotal = 0;
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
    console.log(this.route)
    for (const order of this.route.ordenes) {
      this.valorTotal += order.valor;
    }

    this.dataSource = new MatTableDataSource<Orden>(this.route.ordenes);
    this.dataSource.paginator = this.paginator;
  }

  findRutaExt(value: string) {
    this.valorTotal = 0;
    // Almacena las ordenes precargadas
    let tempOrders : Orden[] = [];

    // Inicializar datos del formulario en nueva busqueda
    this.routeForm.reset();
    this.dataSource = new MatTableDataSource<Orden>([]);
    this.dataSource.paginator = this.paginator;

    // Se verifica si existe la ruta en el sistema
    this.apiService.getRuta(parseInt(value)).subscribe({
      next: (resp: any) => {

        if(resp.message === 'success'){
          const ruta: Ruta = resp.data;
          console.log('Data received:', ruta);
          this.route = ruta;
          this.cargarConductor();
          this.isEditRoute = true;

          for (const order of this.route.ordenes) {
            this.valorTotal += order.valor;
          }

          this._snackBar.open('La ruta existe en el sistema', 'Redirigido a Editar',{
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

        } else {
          console.log('Ha ocurrido un error. Detalles: ', resp.error.message);
        }
      },
      error: (err) => {
        console.log('An error occurred:', err);
      },
      complete: () => {}
      }
    );


    // Se consulta en el servicio externo si existe la ruta.
    if (!this.isEditRoute) {
      this.apiService.getRoute(parseInt(value)).subscribe({
        next: async (resp: any) => {
          // Handle the successful response
          if(resp.message === 'success'){
            const route: Route = resp.data;

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
                this.valorTotal += order.value;
              }
            }
            this.dataSource = new MatTableDataSource<Orden>(tempOrders);
            this.dataSource.paginator = this.paginator;
            if (this.readyToAdd) {
              this._snackBar.open('La ruta existe en el servicio externo', 'Precargado',{
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
          }
          } else {
            console.log('Ha ocurrido un error. Detalles: ', resp.error.message);
            if (!this.isEditRoute && !this.readyToAdd) {
              this._snackBar.open('Upss la ruta no existe', 'No podemos continuar',{
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            }
          }

        },
        error: (err) => {
          console.log('An error occurred:', err);
          // Handle the error
        },
        complete: () => {
        }
        }
      );
    }

  }

  updatePrioridad(orden: Orden) {
    orden.prioritario = !orden.prioritario;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
  }

  // Asingna una copia estructurada de la Ruta lista para guardar
  mapToRuta(formValue: any): Ruta {
    return {
      id_ruta: parseInt(formValue.id_ruta),
      conductor: parseInt(formValue.conductor.ID), // Assuming conductor is an object with a 'value' property
      fecha_entrega: new Date(formValue.fecha_entrega).toISOString(),
      notas: formValue.notas,
      ordenes: this.dataSource.data
    };
  }

  guardarRuta() {
    let rutaFormValue:Ruta =  this.mapToRuta(this.routeForm.value);

    if(!this.isEditRoute){
      this.apiService.crearRuta(rutaFormValue).subscribe({
        next: (response: any) => {
          if (response.message) {
            this.dialogRef.close({type: 'success', message: `La ruta #${rutaFormValue.id_ruta} ha sido creada correctamente!`});
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
    } else {
      this.apiService.editarRuta(rutaFormValue).subscribe({
        next: (response: any) => {
          if (response.message) {
            this.dialogRef.close({type: 'success', message: `La ruta #${rutaFormValue.id_ruta} ha sido actualizada correctamente!`});
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
  }

  eliminarRuta() {
    // ConfirmDialogComponent
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Está seguro de eliminar la ruta ${this.routeForm.value.id_ruta}?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService.eliminarRuta(this.routeForm.value.id_ruta).subscribe({
          next: (response: any) => {
            if (response.message === 'success') {
              this.dialogRef.close({type: 'error', message:`Se ha eliminado correctamente la Ruta #${this.routeForm.value.id_ruta} y sus ordenes.`});
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
