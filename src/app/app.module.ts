import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoinPaymentsModule } from 'coin-payments-lib';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoinPaymentsModule.forRoot("6cc715c19f4219c8851199a8a3b0a349e10c1ba1b493274c2a149e9cb57d232f","39A670A87809FAebD6bf1D750627d9adcBfb9Ea7D9Ed35ba982A2A795eea1342")
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
