package backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class InventoryAdjustRequest {

    @NotBlank(message = "Adjustment type is required")
    @Pattern(regexp = "INCREASE|DECREASE", message = "Adjustment type must be INCREASE or DECREASE")
    private String adjustmentType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be greater than 0")
    private Integer quantity;

    private String reason;

    public InventoryAdjustRequest() {
    }

    public InventoryAdjustRequest(String adjustmentType, Integer quantity, String reason) {
        this.adjustmentType = adjustmentType;
        this.quantity = quantity;
        this.reason = reason;
    }

    public String getAdjustmentType() {
        return adjustmentType;
    }

    public void setAdjustmentType(String adjustmentType) {
        this.adjustmentType = adjustmentType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}