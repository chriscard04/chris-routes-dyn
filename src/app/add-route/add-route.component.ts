import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ruta } from '../interfaces/route.interface'
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-add-route',
  imports: [
    MatToolbarModule
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  readonly dialogRef = inject(MatDialogRef<AddRouteComponent>);
  readonly data = inject<Ruta>(MAT_DIALOG_DATA);
  readonly route = this.data;

}
