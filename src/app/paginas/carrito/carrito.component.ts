import { Component, OnInit  } from '@angular/core';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any = {};
  total:number=0;
  id_neg:number=0;
  constructor(
    private carritoService: CarritoService,
    private location: Location,
    private route:ActivatedRoute
    ) {}

    ngOnInit() {
      const id_negString = this.route.snapshot.paramMap.get('id');
      if (id_negString === null) {
        throw new Error("El parámetro 'id' no está presente en la URL.");
      }
      const id_neg = parseInt(id_negString, 10);
    
      this.id_neg=id_neg;
      console.log("negocioId:", this.id_neg)
      this.carrito = this.carritoService.obtenerCarrito();
      this.actualizarTotal();
      
    }
  
    private actualizarTotal(): void {
      this.total = this.carritoService.calcularTotal();
    }
  goBack(): void {
    this.location.back();
  }
  vaciarCarrito():void{
    this.carritoService.vaciarCarrito()
    this.ngOnInit()
  }
  confirmarCarrito():void{
    this.carritoService.guardarCarrito(this.id_neg).pipe(
      tap(() => {
        this.goBack();
      }),
      catchError(() => {
        alert("Error al Actualizar Producto");
        return of(null);
      })
    )
    .subscribe();
    this.carritoService.vaciarCarrito();
  }
}
