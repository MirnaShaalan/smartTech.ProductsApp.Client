import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../Interfaces/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  //Add Your Port Number
  apiURL: string ='https://localhost:44333/api/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  getProducts() {
    return this.http.get(`${this.apiURL}product/get`);
  }

  addProduct(product: Product){
     return this.http.post<Product>(`${this.apiURL}product/add`, product , this.httpOptions);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiURL}product/delete?id=`+ id);
  }

  editProduct(product : Product) {
    return this.http.put<Product>(`${this.apiURL}product/edit`, product , this.httpOptions);
  }


}
