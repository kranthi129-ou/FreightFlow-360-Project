package backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import backend.dto.ProductRequest;
import backend.dto.ProductResponse;
import backend.model.Product;
import backend.repository.ProductRepository;
import backend.exception.DuplicateResourceException;
import backend.exception.ResourceNotFoundException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::new)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductEntityById(id);
        return new ProductResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists: " + request.getSku());
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setUnitPrice(request.getUnitPrice());
        product.setReorderLevel(request.getReorderLevel());

        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductEntityById(id);

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists: " + request.getSku());
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setUnitPrice(request.getUnitPrice());
        product.setReorderLevel(request.getReorderLevel());

        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = findProductEntityById(id);
        productRepository.delete(product);
    }

    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository
                .findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword
                )
                .stream()
                .map(ProductResponse::new)
                .toList();
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(ProductResponse::new)
                .toList();
    }

    private Product findProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}