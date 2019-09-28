import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  readonly baseUrl = 'http://127.0.0.1:8000/api/events';
  headers: HttpHeaders  = new HttpHeaders();

  constructor(private http : HttpClient) { }

  addEvent(event) {
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl, event,{headers:this.headers});
  }

getEvents(date) {
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl+'/get', {"date":date},{headers:this.headers});
  }

  deleteEvent(id){
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl+'/delete' , {"id":id}, {headers:this.headers});
  }

  editEvent(id){
    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    return this.http.post(this.baseUrl+'/edit', {"id":id} ,{headers:this.headers});
  }
}
