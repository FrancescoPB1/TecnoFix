import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvanceReparacion } from '../../models/modelos';


@Component({
  selector: 'app-lista-avances',
  imports: [DatePipe],
  templateUrl: './lista-avances.html',
})
export class ListaAvances {
  @Input({ required: true }) avances: AvanceReparacion[] = [];
}