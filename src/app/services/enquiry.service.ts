import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpHeaderResponse } from '@angular/common/http'

import {Enquiry } from '../models/enquiry-details'

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  enquiry : Enquiry[];
  readonly baseUrl = 'http://127.0.0.1:8000/api/enquiries';

  options:any;

  constructor(private http : HttpClient) {
      //this.headers.append('enctype','multipart/form-data');

      
      //this.options = new HttpHeaderResponse();
   }

   headers: HttpHeaders  = new HttpHeaders();
  postProduct(enqs: Enquiry){
    let d = {
      "query": "query{ login(email:\"hello1@test.com\",password:\"hello1\"){token} }"
    };
    this.headers = this.headers.append('Content-Type','application/json');
    // this.headers.append('X-Requested-With','XMLHttpRequest');
    //this.headers = this.headers.append('Access-Control-Allow-Methods', 'POST');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');
    //this.headers = this.headers.append('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');

    console.log("hhjjh",this.headers);
    return this.http.post(this.baseUrl, enqs,{headers:this.headers});
  }
}
