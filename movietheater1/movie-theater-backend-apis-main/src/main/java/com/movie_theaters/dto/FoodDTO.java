package com.movie_theaters.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodDTO {
    private Long id;
    private String name;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private String description;
    private Boolean isEnabled;
    private String status; // Derived field for UI

    public String getStatus() {
        if (isEnabled == null || !isEnabled) {
            return "Ngừng bán";
        }
        if (stock == null || stock <= 0) {
            return "Hết hàng";
        }
        return "Còn hàng";
    }
} 