import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly baseUrl = 'http://127.0.0.1:8000/api';
  headers: HttpHeaders  = new HttpHeaders();

  constructor(private http : HttpClient) { }

  login(data){
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl+'/login', data, {headers:this.headers});
  }
  changePwd(data){
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl+'/password/change', data, {headers:this.headers});
  }
}
