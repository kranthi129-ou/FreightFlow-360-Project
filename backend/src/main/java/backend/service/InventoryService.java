package backend.service;

import backend.dto.InventoryAdjustRequest;
import backend.dto.InventoryResponse;
import backend.model.Product;
import backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import backend.exception.InsufficientStockException;
import backend.exception.InvalidRequestException;
import backend.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<InventoryResponse> getAllInventory() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToInventoryResponse)
                .toList();
    }

    public List<InventoryResponse> getLowStockInventory() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(this::mapToInventoryResponse)
                .toList();
    }

    @Transactional
    public InventoryResponse adjustInventory(Long productId, InventoryAdjustRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Integer currentQuantity = product.getQuantity();
        Integer adjustmentQuantity = request.getQuantity();

        if ("INCREASE".equals(request.getAdjustmentType())) {
            product.setQuantity(currentQuantity + adjustmentQuantity);
        } else if ("DECREASE".equals(request.getAdjustmentType())) {
            if (adjustmentQuantity > currentQuantity) {
                throw new InsufficientStockException("Stock cannot go below 0. Available quantity: " + currentQuantity);
            }

            product.setQuantity(currentQuantity - adjustmentQuantity);
        } else {
            throw new InvalidRequestException("Invalid adjustment type. Use INCREASE or DECREASE.");
        }

        Product updatedProduct = productRepository.save(product);

        return mapToInventoryResponse(updatedProduct);
    }

    private InventoryResponse mapToInventoryResponse(Product product) {
        boolean lowStock = product.getQuantity() <= product.getReorderLevel();

        return new InventoryResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getCategory(),
                product.getQuantity(),
                product.getReorderLevel(),
                product.getUnitPrice(),
                lowStock
        );
    }
}