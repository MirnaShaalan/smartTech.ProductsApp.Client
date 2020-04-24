import { Product } from 'src/app/Interfaces/Product';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductsService } from 'src/app/Services/products.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent  {

  constructor(
    private productsService: ProductsService,
    private _sanitizer: DomSanitizer){ }

  public productData: Product;
  public productImage:any;
  public isDeleteDialogDisplayed:boolean=false;
  public isEditDialogDisplayed:boolean=false;

  @Input() 
  set product(value:Product){
    this.productData=value;
    this.productImage=
    this._sanitizer.
      bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+this.productData.photo)     
  };

  @Output() onEdit = new EventEmitter<Product>();
  @Output() onDelete = new EventEmitter<any>();

  deleteProduct(productDel: Product): void {
    this.productsService.deleteProduct(productDel.id)
    .subscribe(result => {
      this.onDelete.emit(" ");
    });
  }

  showEditDialog()
  {
    this. isEditDialogDisplayed=true;
    this.onEdit.emit(this.productData);
  }

  showDeleteDialog()
  {
    this.isDeleteDialogDisplayed=true;
  }

  confirmDeleteProduct(iaDeletable:boolean , productToDelete?: Product)
  {
    if(iaDeletable==true)
      this.deleteProduct(productToDelete)
    
    this.isDeleteDialogDisplayed=false;
  }

}
