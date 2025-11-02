import { Injectable } from '@angular/core';
import { SMETHRESHOLD } from '../shared';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {

  constructor() { }

  isSMEApplicable(estValue: number): boolean {
    return estValue >= SMETHRESHOLD.VALUE
  }
  

}
