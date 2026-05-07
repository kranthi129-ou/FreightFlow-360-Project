package backend.controller;

import backend.dto.InventoryAdjustRequest;
import backend.dto.InventoryResponse;
import backend.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:4200")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/low-stock")
    public List<InventoryResponse> getLowStockInventory() {
        return inventoryService.getLowStockInventory();
    }

    @PutMapping("/{productId}/adjust")
    public InventoryResponse adjustInventory(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryAdjustRequest request
    ) {
        return inventoryService.adjustInventory(productId, request);
    }
}