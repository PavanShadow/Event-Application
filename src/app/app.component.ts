import { Component , Injectable, ViewChild, OnInit, TemplateRef, ElementRef} from '@angular/core';
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
// import { TokenService } from './services/token.service';

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
  IsLoginmodelShow = true;
  events: any;

  user: any;
  isLoggedIn = false;

  bsModalRef: BsModalRef;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  @ViewChild('closeLoginBtn') closeLoginBtn: ElementRef;
  @ViewChild('closeChangeBtn') closeChangeBtn: ElementRef;
  
  // date= new Date();

  constructor(private http: HttpClient,
              private enqservice: EnquiryService,
              private eventService: EventService,
              private loginService: LoginService,
              // private tokenService : TokenService,
              private modalService: BsModalService){ }

  ngOnInit() {
    // this.eventService.getEvents(data).subscribe(data=>{

    // })

    let x = localStorage.getItem('user');
    if(x != undefined) {
      this.user = x;
      this.isLoggedIn = true;
    }

    this.options = {
      editable: true,
      events: [], //{title: 'Long Event',start: '2019-09-26 17:25',end: '2019-09-27 16:00'}
      customButtons: { },
      header: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      plugins: [ dayGridPlugin, interactionPlugin ]
    };

    this.eventService.getAllEvents()
    .then(data=>{
        this.events = data;
        this.options.events = data;
        console.log(data);
    });

  }

  	onSubmit(form: NgForm){
      console.log('form',form.value);
      this.enqservice.postEnquiry(form.value).subscribe((res) => {
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
          // console.log(d);
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

    onLogin(form) {
      console.log('form', form.value);
      this.loginService.login(form.value).subscribe(data=>{
        if(data['success'] == true) {
          this.isLoggedIn = true;

          this.closeLoginBtn.nativeElement.click();

          localStorage.setItem('token',data['access_token']);
          localStorage.setItem('user',data['user'][0]['name']);

          this.user = data['user'][0]['name'];

          let body = document.querySelector('.modal-open');
          body.classList.remove('modal-open');
          body.removeAttribute('style');
          let divFromHell = document.querySelector('.modal-backdrop');
          body.removeChild(divFromHell);
        }
        else{
          this.error = data['error'];
        }
      });
    }

    onChangePwd(form){
      console.log('form', form.value);
      this.loginService.changePwd(form.value).subscribe(data=>{
        if(this.isLoggedIn){
          alert("Update Success");

          this.closeChangeBtn.nativeElement.click();

          let body = document.querySelector('.modal-open');
          body.classList.remove('modal-open');
          body.removeAttribute('style');
          let divFromHell = document.querySelector('.modal-backdrop');
          body.removeChild(divFromHell);



        }
      })
    }
   
    logout() {
      if(confirm("Do you need to logout?")) {

        localStorage.clear();
        this.user = undefined;
        this.isLoggedIn = false;
      }
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
        <button class="btn btn-primary" (click)="clickEditEvent(item.id)">Edit</button>
        <button class="btn btn-danger" (click)="deleteEvent(item.id)">Delete</button>

        </li>
      </ul>
    </div>

    <hr>

    <div class="container">
      <form *ngIf="isSaveMode" #evntForm="ngForm" (ngSubmit)="addEvent(evntForm)">
      <div class="form-group">
        <label for="name">Title</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="title"  required>
        
      </div>
      <div class="form-group">
        <label for="name">Start time</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="startTime" required >
        
      </div>
      <div class="form-group">
        <label for="name">End time</label><span class="star">*</span>
        <input type="text" class="form-control" ngModel name="endTime" required >
        
      </div>
      <div class="form-group"><button class="btn btn-success" type='submit' [disabled]="!evntForm.valid">Add</button></div>
      </form>

      <div *ngIf="!isSaveMode">
          <div class="form-group">
          <label for="name">Title</label><span class="star">*</span>
          <input type="text" class="form-control" [(ngModel)]="edit_title" name="title"  required value="selectedEvent[0]['title']">
          
        </div>
        <div class="form-group">
          <label for="name">Start time</label><span class="star">*</span>
          <input type="text" class="form-control" [(ngModel)]="edit_start" name="startTime" required value="selectedEvent[0]['start']" >
          
        </div>
        <div class="form-group">
          <label for="name">End time</label><span class="star">*</span>
          <input type="text" class="form-control" [(ngModel)]="edit_end" name="endTime" required value="selectedEvent[0]['end']" >
          
        </div>
        <div class="form-group"><button class="btn btn-warning" type='' (click)="editEvent()">Update</button></div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-warning" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  ` 
})
 
export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  isSaveMode = true;
  selectedEvent: any = {};
 
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
          location.reload();
        }
      });
  }

  deleteEvent(id){
    // console.log(id);
    this.eventService.deleteEvent(id)
    .subscribe((res) => {
      alert("successfully deleted");
      this.bsModalRef.hide();
      location.reload();
    })
  }

  edit_title = "";
  edit_start = "";
  edit_end = "";

  clickEditEvent(id) {
    this.selectedEvent = this.list.filter(l => l.id == id);
    console.log(this.selectedEvent[0]['title']);

    this.edit_title = this.selectedEvent[0]['title'];
    this.edit_start = this.selectedEvent[0]['start'];
    this.edit_end = this.selectedEvent[0]['end'];

    this.isSaveMode = false;
  }
  editEvent(id){
    // data.value['date'] = this.title;
    let data = {
      'id' : this.selectedEvent[0]['id'],
      'title' : this.edit_title,
      'start' : this.edit_start,
      'end'   : this.edit_end
    };

    this.eventService.editEvent(data)
    .subscribe((res) =>{
     console.log("e_r",res);

     if(res['success']) {
       alert('Updated successfull!');

       this.bsModalRef.hide();
       location.reload();
     }
     else {
       alert("Error Occured");
     }
    })
  }

  
}
