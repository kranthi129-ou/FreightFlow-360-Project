package backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import backend.model.Product;

public class ProductResponse {

    private Long id;
    private String name;
    private String sku;
    private String category;
    private String description;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Integer reorderLevel;
    private boolean lowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.sku = product.getSku();
        this.category = product.getCategory();
        this.description = product.getDescription();
        this.quantity = product.getQuantity();
        this.unitPrice = product.getUnitPrice();
        this.reorderLevel = product.getReorderLevel();
        this.lowStock = product.getQuantity() <= product.getReorderLevel();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public boolean isLowStock() {
        return lowStock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}