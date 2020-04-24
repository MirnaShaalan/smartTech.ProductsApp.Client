import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/Services/products.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductCreationComponent } from '../product-creation/product-creation.component';
import { Product } from 'src/app/Interfaces/Product';


@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.css']
})
export class ProductsViewComponent implements OnInit {

  constructor(private productsService: ProductsService,
    private _sanitizer: DomSanitizer) { }

  public displayDialog: boolean = false;
  public products:any;
  public imagePath:any;
  public searchParameter:string;
  public dialogTitle:string="Add Product";
  private productsToSearch: Product[];

  @ViewChild(ProductCreationComponent)
  productCreationComponent: ProductCreationComponent;
  
  ngOnInit() {
    this.initialize();
  }

  initialize()
  {
    this.getProducts();
  }

  showProductDialog() 
  {
    this.displayDialog = true;
  }

  hideBasicDialog() 
  {
    this.displayDialog = false;
  }

  getProducts()
  {
    this.productsService.getProducts()
    .subscribe( 
      result => {this.products=result;   
      this.imagePath = this._sanitizer.
        bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+result[0].photo);
        this.productsToSearch=this.products;}
    )
  }

  updateProducts(event)
  {
    this.getProducts();
    this.hideBasicDialog();
  }

  onEditProduct(product){
    this.dialogTitle="Edit Product"
    this.productCreationComponent.editMode(product);
    this.showProductDialog();
  }

  serchProducts()
  {
    if(this.searchParameter)
    {
      this.products=this.productsToSearch
      .filter(product=>product.name.toUpperCase()
      .includes(this.searchParameter.toUpperCase()))
    }
    else{
      this.products=this.productsToSearch;
    }
  }

  closeDialog()
  {
    this.productCreationComponent.resetDialog();
    this.dialogTitle="Add Product";
  }

  ConvertToCSV(objectsToConvert) {
    var array = typeof objectsToConvert !=
     'object' ? JSON.parse(objectsToConvert) : objectsToConvert;
    var data = '';
    var row = "";

    for (var index in objectsToConvert[0]) {
      row += index + ',';
    }
    row = row.slice(0, -1);
    data += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
          line += array[i][index];
      }
      data += line + '\r\n';
    }
    return data;
  }

  downloadExportedProducts(){ 
    let ProductaToExport=
    this.products.map(p=>
      {return {id:p.id,name:p.name,price:p.price}});

    var csvData = this.ConvertToCSV(ProductaToExport);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'Products.csv';/* file name*/
    a.click();
    return 'success';
  }

}
