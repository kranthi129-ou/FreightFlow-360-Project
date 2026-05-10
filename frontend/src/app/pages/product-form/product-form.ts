import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  productId?: number;
  isEditMode = false;
  loading = false;
  saving = false;
  errorMessage = '';

  productForm = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    category: [''],
    description: [''],
    quantity: [0, [Validators.min(0)]],
    unitPrice: [0, [Validators.min(0)]],
    reorderLevel: [0, [Validators.min(0)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.productId = Number(idParam);
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.productService.getProductById(id)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            sku: product.sku,
            category: product.category,
            description: product.description || '',
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            reorderLevel: product.reorderLevel
          });

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Load product error:', error);
          this.errorMessage = 'Unable to load product details. Check that this product exists.';
          this.cdr.detectChanges();
        }
      });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    const product: Product = {
      name: formValue.name || '',
      sku: formValue.sku || '',
      category: formValue.category || '',
      description: formValue.description || '',
      quantity: Number(formValue.quantity ?? 0),
      unitPrice: Number(formValue.unitPrice ?? 0),
      reorderLevel: Number(formValue.reorderLevel ?? 0)
    };

    this.saving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, product)
        .pipe(
          timeout(8000),
          finalize(() => {
            this.saving = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/app/products']);
          },
          error: (error) => {
            console.error('Update product error:', error);
            this.errorMessage = 'Visitor can’t update products. Please reach out to Kranthi to get admin access.';
            this.cdr.detectChanges();
          }
        });

      return;
    }

    this.productService.createProduct(product)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/app/products']);
        },
        error: (error) => {
          console.error('Create product error:', error);
          this.errorMessage = 'Visitor can’t make changes. Please reach out to Kranthi to get admin access.';
          this.cdr.detectChanges();
        }
      });
  }

  hasError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}