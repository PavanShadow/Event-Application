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

  constructor(private http : HttpClient) {}

   headers: HttpHeaders  = new HttpHeaders();
    postEnquiry(enqs: Enquiry){ 

    this.headers = this.headers.append('Content-Type','application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin','*');

    // console.log("hhjjh",this.headers);
    return this.http.post(this.baseUrl, enqs, {headers:this.headers});
  }
}
