import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import {
  CoreModule,
  SidebarModule,
  LayoutModule,
  ButtonModule,
  TopbarModule,
  MenuModule,
  IconModule
} from '@slb-planck-ui/web-components';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SidebarModule,
    LayoutModule,
    ButtonModule,
    TopbarModule,
    MenuModule,
    IconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
