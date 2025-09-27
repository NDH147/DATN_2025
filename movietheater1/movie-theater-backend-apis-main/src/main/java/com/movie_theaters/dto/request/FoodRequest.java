package com.movie_theaters.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodRequest {
    private Long id;
    private String name;
    private double price;
    private int stock;
    private MultipartFile image;
    private String description;
    private Boolean isEnabled;
} 