import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { ProductsService } from 'src/app/Services/products.service';
import { getLocaleDateTimeFormat } from '@angular/common';
import { Product } from 'src/app/Interfaces/Product';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService
    ,private _sanitizer: DomSanitizer) { }

  public isSumbitButtonDisabled: boolean;
  public imageToPreview:any;
  public createProductForm: FormGroup;
  private productId: number;
  private productName :string;
  private productPrice:number;
  private productImage:string;
  private isEditable:boolean=false;

  @Output() add = new EventEmitter<any>();

  @ViewChild('ImageUpload') myInputVariable: any;

  ngOnInit()
  {
    this.initialize();
  }

  initialize()
  {
    this.composeFormValues();
    this.disableSubmitButton();
  }

  private composeFormValues() 
  {
    this.createProductForm = this.formBuilder.group({     
        photo: new FormControl(this.productImage, Validators.required),
        price: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required)
    }); 
  }

  submit()
  {
    if(this.isEditable)
    {
      this.editProduct()
    }
    else{
      this.addProduct()
    }

  }

  addProduct(){
    let newProduct: Product;
    this.createProductForm.controls.photo.setValue(this.productImage);
    newProduct = this.createProductForm.value;
    newProduct.lastUpdated= new Date().toISOString();

    this.productsService.addProduct(newProduct)
    .subscribe(response => {
      this.createProductForm.value['productId'] = response.id;
      this.add.emit(" ");   
    });
  }

  editProduct(){
    let newProduct: Product
    this.createProductForm.controls.photo.setValue(this.productImage);
    newProduct = this.createProductForm.value;
    newProduct.id=this.productId;
    newProduct.lastUpdated= new Date().toISOString();

    this.productsService.editProduct(newProduct)
    .subscribe((response) => {
          this.add.emit(" ");
    }); 
  }

  onImageSelected(event) {
    console.log(event);
    let _this = this;
    let result;
    let file = event.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      result =reader.result;
      _this.setImage(result);
      _this.disableSubmitButton();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    this.myInputVariable.clear();
  }


  setImage(image: any)
  {
    this.imageToPreview=image;
    this.productImage=image.toString().split(",")[1];;
  }


  editMode(product : Product)
  {
    this.isEditable=true;
    this.productId=product.id;
    this.productName=product.name;
    this.createProductForm.controls['name'].setValue(product.name);
    this.createProductForm.controls['price'].setValue(product.price);
    this.createProductForm.controls['photo'].setValue(product.photo);
    this.productImage=product.photo;
    this.imageToPreview=
    this._sanitizer
      .bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+this.productImage);
    this.isSumbitButtonDisabled=true;
  }

  resetDialog()
  {
    this.productId=null;
    this.productName='';
    this.productImage=null;
    this.imageToPreview=null;
    this.createProductForm.controls['name'].reset();
    this.createProductForm.controls['price'].reset();
    this.createProductForm.controls['photo'].reset();
    this.isEditable=false;
    this.myInputVariable.clear();
  }

  disableSubmitButton()
  {
    let name= this.createProductForm.get('name').value;
    let price= this.createProductForm.get('price').value;
    
    if(this.productImage==null||!price||!name){
      this.isSumbitButtonDisabled=true;
    }
    else
    {
      this.isSumbitButtonDisabled=false;
    }
  }

}




