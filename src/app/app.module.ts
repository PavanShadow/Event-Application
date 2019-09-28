import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from 'ng-fullcalendar';

import { AppComponent } from './app.component';
import { ModalContentComponent } from './app.component';

import { ModalModule } from 'ngx-bootstrap/modal';
// import { TokenService } from './services/token.service';
import { LoginService } from './services/login.service';

@NgModule({
  declarations: [
    AppComponent,
    ModalContentComponent
  ],
  entryComponents: [
    ModalContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FullCalendarModule,
    ModalModule.forRoot(),
  ],
  providers: [ LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
