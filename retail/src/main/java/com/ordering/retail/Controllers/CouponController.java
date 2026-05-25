package com.ordering.retail.Controllers;

import java.util.List;

import com.ordering.retail.DTOs.CouponRequestDTO;
import com.ordering.retail.DTOs.CouponResponseDTO;
import com.ordering.retail.Service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Coupons", description = "Manage discount coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    @Operation(summary = "Get all coupons")
    public List<CouponResponseDTO> findAll() {
        return couponService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get coupon by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coupon found"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public CouponResponseDTO findById(@PathVariable Long id) {
        return couponService.findById(id);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get coupon by code")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coupon found"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public CouponResponseDTO findByCode(@PathVariable String code) {
        return couponService.findByCode(code);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create coupon")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Coupon created"),
            @ApiResponse(responseCode = "400", description = "Validation failed")
    })
    public CouponResponseDTO create(@Valid @RequestBody CouponRequestDTO request) {
        return couponService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update coupon")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coupon updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public CouponResponseDTO update(@PathVariable Long id, @Valid @RequestBody CouponRequestDTO request) {
        return couponService.update(id, request);
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Activate or deactivate coupon")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coupon activation updated"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public CouponResponseDTO setActive(@PathVariable Long id,
            @Parameter(description = "Set true to activate, false to deactivate") @RequestParam boolean active) {
        return couponService.setActive(id, active);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete coupon")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Coupon deleted"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public void delete(@PathVariable Long id) {
        couponService.delete(id);
    }
}