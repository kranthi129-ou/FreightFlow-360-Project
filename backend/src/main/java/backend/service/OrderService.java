package backend.service;

import backend.dto.OrderItemRequest;
import backend.dto.OrderItemResponse;
import backend.dto.OrderRequest;
import backend.dto.OrderResponse;
import backend.dto.OrderStatusUpdateRequest;
import backend.exception.InsufficientStockException;
import backend.exception.ResourceNotFoundException;
import backend.model.Order;
import backend.model.OrderItem;
import backend.model.OrderStatus;
import backend.model.Product;
import backend.repository.OrderRepository;
import backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + itemRequest.getProductId()
                    ));

            Integer requestedQuantity = itemRequest.getQuantity();
            Integer availableQuantity = product.getQuantity();

            if (requestedQuantity == null || requestedQuantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero.");
            }

            if (availableQuantity == null) {
                availableQuantity = 0;
            }

            if (requestedQuantity > availableQuantity) {
                throw new InsufficientStockException(
                        "Not enough stock for product: " + product.getName()
                                + ". Available: " + availableQuantity
                                + ", Requested: " + requestedQuantity
                );
            }

            BigDecimal unitPrice = product.getUnitPrice();

            if (unitPrice == null) {
                unitPrice = BigDecimal.ZERO;
            }

            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(requestedQuantity));

            OrderItem orderItem = new OrderItem(
                    product,
                    product.getName(),
                    requestedQuantity,
                    unitPrice,
                    subtotal
            );

            order.addItem(orderItem);

            product.setQuantity(availableQuantity - requestedQuantity);
            productRepository.save(product);

            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(request.getStatus());

        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(this::mapToOrderItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses
        );
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        Long productId = null;

        if (item.getProduct() != null) {
            productId = item.getProduct().getId();
        }

        return new OrderItemResponse(
                item.getId(),
                productId,
                item.getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal()
        );
    }
}