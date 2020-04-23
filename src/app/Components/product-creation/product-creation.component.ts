import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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

  id: number;
  isSumbitButtonDisabled: boolean;
  imageToPreview:any;
  name :string;
  price:number;
  image:string;
  createProductForm: FormGroup;
  _productToEdit: Product;
  isEditable:boolean=false;

  @Output() add = new EventEmitter<any>();

  ngOnInit(): void 
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
        photo: new FormControl(this.image, Validators.required),
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
    this.createProductForm.controls.photo.setValue(this.image);
    newProduct = this.createProductForm.value;
    newProduct.lastUpdated= new Date().toISOString();

    this.productsService.addProduct(newProduct)
    .subscribe(response => {
      this.createProductForm.value['id'] = response.id;
      this.add.emit(" ");   
    });
  }

  editProduct(){
    let newProduct: Product
    this.createProductForm.controls.photo.setValue(this.image);
    newProduct = this.createProductForm.value;
    newProduct.id=this.id;
    newProduct.lastUpdated= new Date().toISOString();

    this.productsService.editProduct(newProduct)
    .subscribe((response) => {
          this.add.emit(" ");
    }); 
  }

  onImageSelected(event) {
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
  }


  setImage(image: any)
  {
    this.imageToPreview=image;
    this.image=image.toString().split(",")[1];;
  }


  editMode(product : Product)
  {
    this.isEditable=true;
    this.id=product.id;
    this.name=product.name;
    this.createProductForm.controls['name'].setValue(product.name);
    this.createProductForm.controls['price'].setValue(product.price);
    this.createProductForm.controls['photo'].setValue(product.photo);
    this.image=product.photo;
    this.imageToPreview=
    this._sanitizer
      .bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+this.image);
    this.isSumbitButtonDisabled=true;
  }

  resetDialog()
  {
    this.id=null;
    this.name='';
    this.image=null;
    this.imageToPreview='';
    this.createProductForm.controls['name'].setValue('');
    this.createProductForm.controls['price'].setValue('');
    this.createProductForm.controls['photo'].setValue('');
    this.isEditable=false;
  }

  disableSubmitButton()
  {
    let name= this.createProductForm.get('name').value;
    let price= this.createProductForm.get('price').value;
    
    if(this.image==null||!price||!name){
      this.isSumbitButtonDisabled=true;
    }
    else
    {
      this.isSumbitButtonDisabled=false;
    }
  }

}




