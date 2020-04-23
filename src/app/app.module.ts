import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './Components/product-card/product-card.component';
import { ProductsViewComponent } from './Components/products-view/products-view.component';
import { HttpClientModule } from '@angular/common/http';
import {ButtonModule} from 'primeng';
import {DialogModule} from 'primeng';
import {InputTextModule , FileUploadModule} from 'primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCreationComponent } from './Components/product-creation/product-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    ProductsViewComponent,
    ProductCreationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FileUploadModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
