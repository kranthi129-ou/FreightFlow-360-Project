package backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {

    private long totalProducts;
    private long totalOrders;
    private long lowStockCount;
    private BigDecimal totalInventoryValue;
    private List<RecentOrderResponse> recentOrders;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(long totalProducts, long totalOrders,
                                    long lowStockCount, BigDecimal totalInventoryValue,
                                    List<RecentOrderResponse> recentOrders) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.lowStockCount = lowStockCount;
        this.totalInventoryValue = totalInventoryValue;
        this.recentOrders = recentOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public List<RecentOrderResponse> getRecentOrders() {
        return recentOrders;
    }
}