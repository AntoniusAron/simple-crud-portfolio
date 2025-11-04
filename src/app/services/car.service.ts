import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class CarService {
  apiUrl: string = "/api/CarRentalApp/";
  constructor(private http: HttpClient) {}

  getAllCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}GetCars`).pipe(
      catchError((error) => {
        console.error('Error fetching cars:', error);
        // Return an empty array in case of error
        return of([]);  // Return an empty array (or fallback) on error
      })
    );
  }
  
  onSaveNewCar(obj: any) {
    return this.http.post(`${this.apiUrl}CreateNewCar`, obj);
  }

  onUpdateCar(obj: any) {
    return this.http.put(`${this.apiUrl}UpdateCar`, obj);
  }

  onDeleteCar(obj:any) {
    return this.http.delete(`${this.apiUrl}DeleteCarbyCarId?carid=${obj}`);
  }

}
