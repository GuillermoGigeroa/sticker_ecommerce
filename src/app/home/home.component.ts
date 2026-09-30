import { Component, OnInit } from '@angular/core';
import { Product } from '../cart/models/product.model';
import { ProductService } from '../cart/services/product.service';
import { CartService } from '../cart/services/cart.service';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
    products: Product[] = [];
    loading = true;
    error: string | null = null;

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private appComponent: AppComponent
    ) {}

    ngOnInit(): void {
        this.loadProducts();
    }

    private loadProducts(): void {
        this.productService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.error = 'Error al cargar productos. Usando datos de ejemplo.';
                this.loading = false;
                this.loadFallbackProducts();
            }
        });
    }

    private loadFallbackProducts(): void {
        this.products = [
            {
                id: 1,
                nombre: 'Sticker Gato',
                descripcion: 'Sticker adorable de gato',
                precio: 5.99,
                imagenBase64: '',
                stock: 100,
                categoria: 'Animales',
                activo: true
            },
            {
                id: 2,
                nombre: 'Sticker Flor',
                descripcion: 'Sticker de flor colorida',
                precio: 4.99,
                imagenBase64: '',
                stock: 50,
                categoria: 'Naturaleza',
                activo: true
            }
        ];
    }

    addToCart(product: Product): void {
        this.cartService.addToCart(product.id, 1).subscribe({
            next: () => {
                this.appComponent.triggerConfetti();
            },
            error: (err) => {
                console.error('Error adding to cart:', err);
                alert('Error al agregar al carrito');
            }
        });
    }

    getImageUrl(product: Product): string {
        if (product.imagenBase64) {
            return 'data:image/png;base64,' + product.imagenBase64;
        }
        return 'assets/images/1.png';
    }
}
