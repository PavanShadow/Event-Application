import { Component , Injectable, ViewChild, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpHeaders , HttpClient } from '@angular/common/http';

import { EnquiryService } from './services/enquiry.service';

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';

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
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;

  constructor(private http: HttpClient,
              private enqservice: EnquiryService){ }

  ngOnInit() {
    this.options = {
      editable: true,
      events: [{
        title: 'Long Event',
        start: '2019-09-26',
        end: '2019-09-27'
      }],
      customButtons: {
        myCustomButton: {
          text: 'custom!',
          click: function() {
            alert('clicked the custom button!');
          }
        }
      },
      header: {
        left: 'prev,next today myCustomButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [ dayGridPlugin, interactionPlugin ]
    };
  }

   
  	onSubmit(form: NgForm){
      console.log('form',form.value);
      this.enqservice.postProduct(form.value).subscribe((res) => {
        // this.resetForm(form);
        alert("Success");
      })
    }

    eventClick(model) {
      console.log(model);
    }
    eventDragStop(model) {
      console.log(model);
    }
    dateClick(model) {
      console.log(model);
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
}
