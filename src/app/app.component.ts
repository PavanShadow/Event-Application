import { Component , Injectable, ViewChild, OnInit, TemplateRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpHeaders , HttpClient } from '@angular/common/http';

import { EnquiryService } from './services/enquiry.service';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



import { EventService } from './services/event.service';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';

@Injectable()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit{
  title = 'client';
  options: OptionsInput;
  eventsModel: any;

  bsModalRef: BsModalRef;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  data: any;

  constructor(private http: HttpClient,
              private enqservice: EnquiryService,
              private eventService: EventService,
              private loginService: LoginService,
              private tokenService : TokenService,
              private modalService: BsModalService){ }

  ngOnInit() {
    this.eventService.getEvents(this.data).subscribe((res) =>{
      console.log(res);
    })
    this.options = {
      editable: true,
      events: [
        // { 
        //   title: 'Long Event',
        //   start: '2019-09-26 17:25',
        //   end: '2019-09-27 16:00'
        // }
      ], //{title: 'Long Event',start: '2019-09-26 17:25',end: '2019-09-27 16:00'}
      customButtons: { },
      header: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      plugins: [ dayGridPlugin, interactionPlugin ]
    };


  }

  // onLogin(form:NgForm){
  //   console.log(form.value);
  // }


  	onSubmit(form: NgForm){
      console.log('form',form.value);
      this.enqservice.postProduct(form.value).subscribe((res) => {
        // this.resetForm(form);
        alert("Success");
        form.reset();
      })
    }

    eventClick(model) {
      console.log(model);
    }
    eventDragStop(model) {
      console.log(model);
    }
    dateClick(data) {
      this.eventService.getEvents(data['dateStr'])
        .subscribe(d=> {
          const initialState = {
            list: d,
            title: data['dateStr']
          };
          console.log(d);
          this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
          this.bsModalRef.content.closeBtnName = 'Close';
        });

      //console.log(model);
    }
    updateEvents() {
      this.eventsModel = [{
        title: 'Updaten Event',
        start: this.yearMonth + '-08',
        end: this.yearMonth + '-10'
      }];
    }
    get yearMonth(): string {
      const dateObj = new Date();
      return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    }

    public form = {
      email:null,
      password:null
    };

    public error = null;

    onLogin(form: NgForm) {
      console.log('form', form.value);
      this.loginService.login(this.form).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
    }
    handleResponse(data){
        this.tokenService.handle(data.access_token);
    }

    handleError(error){
        this.error = error.error.error;
    }
}




@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <ul *ngIf="list.length">
        <li *ngFor="let item of list">
        
        {{item['title']}} <br> {{ item['start'] }}  ||  {{ item['end'] }}
        <button class="btn btn-primary" (click)="editEvent(item)">Edit</button>
        <button class="btn btn-danger" (click)="deleteEvent(item.id)">Delete</button>

        </li>
      </ul>
    </div>

    <hr>

    <div class="container">
      <form #evntForm="ngForm" (ngSubmit)="addEvent(evntForm)">
      <div class="form-group">
        <label for="name">Title</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="title"  >
        
      </div>
      <div class="form-group">
        <label for="name">Start time</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="startTime"  >
        
      </div>
      <div class="form-group">
        <label for="name">End time</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="endTime"  >
        
      </div>
      <div class="form-group"><button class="btn btn-success" type='submit'>Add</button></div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  ` 
})
 
export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
 
  constructor(public bsModalRef: BsModalRef, private eventService: EventService,
    private http: HttpClient) {}
 
  ngOnInit() {
    //this.list.push('ghgjhgjhg!!!');
  }

  
  addEvent(data) {
    data.value['date'] = this.title;
    // console.log(this.title);
    this.eventService.addEvent(data.value)
      .subscribe(data=> {
        if(data['success']){
          
          alert('Inserted');
          this.bsModalRef.hide();
        }
      });
  }

  deleteEvent(id){
    // console.log(id);
    this.eventService.deleteEvent(id)
    .subscribe((res) => {
      alert("successfully deleted");
      this.bsModalRef.hide();
    })
  }

  editEvent(data){
    data.value['date'] = this.title;
    
    this.eventService.editEvent(data)
    .subscribe((res)=> {
      alert("sucessefully updated");
      this.bsModalRef.hide();
    })
  }

  

  

}
