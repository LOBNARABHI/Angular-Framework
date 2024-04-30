import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  constructor( private productService:ProductService,
               private router : Router,
               public  appstate : AppStateService) {
  }

  ngOnInit(){
    this.searchProducts();
  }

  searchProducts(){
    /*this.appstate.setProductState({
      status : "LOADING"
    })*/
    this.productService.searchProducts(this.appstate.productsState.keyword,
      this.appstate.productsState.currentPage,
      this.appstate.productsState.pageSize).subscribe({
      next : (resp)=>{
        let products=resp.body as Product[];
        let totalProducts:number = parseInt(resp.headers.get('x-total-count')!) ;
        //this.appstate.productsState.totalProducts = totalProducts;
        let totalPages =
         Math.floor(totalProducts/this.appstate.productsState.pageSize);
        if(totalProducts % this.appstate.productsState.pageSize != 0){
          ++totalPages;
        }
        this.appstate.setProductState({
          products : products,
          totalProducts : totalProducts,
          totalPages : totalPages,
          status : "LOADED"
        })
        console.log(totalProducts);
      },
      error : err =>{
        this.appstate.setProductState({
          status  : "ERROR",
          errorMessage : err
        })
        console.log(err);
      }
    })
  }


  handelCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next : updatedProduct => {
        product.checked=!product.checked
      }
    })
  }

  handelDelete(product: Product) {
    if(confirm("ees vous sur"))
    this.productService.deleteProduct(product).subscribe({
      next:value => {
        /*this.productService.getProducts().subscribe({
          next : data=>{
            this.products=data
          },
          error : err =>{
            console.log(err);
          }
        })*/
        //this.appstate.productsState.products=this.appstate.productsState.products.filter((p:any)=>p.id!=product.id)
        this.searchProducts();
      }
      })
  }



  handleGoToPage(page: number) {

    this.appstate.productsState.currentPage = page;
    this.searchProducts();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/admin/editProduct/${product.id}`)
  }
}
