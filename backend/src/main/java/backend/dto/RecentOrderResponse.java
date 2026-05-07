package backend.dto;

import backend.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecentOrderResponse {

    private Long id;
    private String customerName;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    public RecentOrderResponse() {
    }

    public RecentOrderResponse(Long id, String customerName, OrderStatus status,
                               BigDecimal totalAmount, LocalDateTime createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}