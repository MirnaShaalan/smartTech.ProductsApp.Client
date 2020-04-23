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

  productsToSearch: Product[];
  displayDialog: boolean = false;
  products:any;
  imagePath:any;
  searchParameter:string;
  dialogTitle:string="Add Product";

  @ViewChild(ProductCreationComponent)
  productCreationComponent: ProductCreationComponent;
  
  ngOnInit() {
    this.initialize();
  }

  initialize()
  {
    this.getProducts();
  }

  showBasicDialog() 
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
    this.showBasicDialog();
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

  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
    var row = "";

    for (var index in objArray[0]) {
        //Now convert each value to string and comma-separated
        row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
  }

  download(){ 
    let ProductaToExport=
    this.products.map(p=>{return {id:p.id,name:p.name,price:p.price}});
  console.log(ProductaToExport);
  console.log(this.products);
    var csvData = this.ConvertToCSV(ProductaToExport);
                          var a = document.createElement("a");
                          a.setAttribute('style', 'display:none;');
                          document.body.appendChild(a);
                          var blob = new Blob([csvData], { type: 'text/csv' });
                          var url= window.URL.createObjectURL(blob);
                          a.href = url;
                          a.download = 'Products.csv';/* your file name*/
                          a.click();
                          return 'success';
  }

}
