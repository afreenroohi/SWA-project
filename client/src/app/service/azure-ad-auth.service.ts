import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AzureAdAuthService {

  isUserLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {}

 
}
