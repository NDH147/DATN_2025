package com.movie_theaters.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String subdirectory) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, subdirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(filename);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            return subdirectory + "/" + filename;
        }
    }

    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Không thể xóa file: " + e.getMessage());
        }
    }
} 