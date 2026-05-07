package backend.service;

import backend.dto.DashboardSummaryResponse;
import backend.dto.RecentOrderResponse;
import backend.model.Order;
import backend.repository.OrderRepository;
import backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long lowStockCount = productRepository.countLowStockProducts();

        BigDecimal totalInventoryValue = productRepository.calculateTotalInventoryValue();

        if (totalInventoryValue == null) {
            totalInventoryValue = BigDecimal.ZERO;
        }

        List<RecentOrderResponse> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToRecentOrderResponse)
                .toList();

        return new DashboardSummaryResponse(
                totalProducts,
                totalOrders,
                lowStockCount,
                totalInventoryValue,
                recentOrders
        );
    }

    private RecentOrderResponse mapToRecentOrderResponse(Order order) {
        return new RecentOrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt()
        );
    }
}