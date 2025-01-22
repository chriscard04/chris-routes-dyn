import { Component, inject, model, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ruta, Conductor } from '../interfaces/route.interface'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../services/drivers.service'
import { HttpClientModule } from '@angular/common/http';


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
  styleUrl: './add-route.component.scss',
  providers: [DriversService]
})
export class AddRouteComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<AddRouteComponent>);
  readonly data = inject<Ruta>(MAT_DIALOG_DATA);
  readonly route = this.data;
  driversService = inject(DriversService);

  conductores: Conductor[] = [];
  conductorSeleccionado: Conductor = {ID: '0', NAME: ''};

  constructor() {
    this.driversService.getConductores().then((conductores: Conductor[]) => {
      this.conductores = conductores;
      this.cargarConductor();
    });
  }

  ngOnInit() {}

  private async cargarConductor() {
    const id = this.route.conductor.toString();
    if (id) {
      this.conductorSeleccionado = await this.driversService.getConductorData(id);
    } else {
      this.conductorSeleccionado = { ID: '0', NAME: '' };
    }
  }

}
