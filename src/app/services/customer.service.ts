import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  apiUrl: string = "/api/CarRentalApp/";
  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}GetCustomers`).pipe(
      catchError((error) => {
        console.error('Error fetching customers:', error);
        // Return an empty array in case of error
        return of([]);  // Return an empty array (or fallback) on error
      })
    );
  }
  
  onSaveNewCustomer(obj: any) {
    return this.http.post(`${this.apiUrl}CreateNewCustomer`, obj);
  }

  onUpdateCustomer(obj: any) {
    return this.http.put(`${this.apiUrl}UpdateCustomer`, obj);
  }

  onDeleteCustomer(obj:any) {
    return this.http.delete(`${this.apiUrl}DeletCustomerById?id=${obj}`);
  }

}
