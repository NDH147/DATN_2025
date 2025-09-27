use movie_theater
GO

-- Thêm dữ liệu cho bảng food
INSERT INTO food (food_name, price, stock, image_food, description, is_enabled) VALUES
(N'Bắp rang bơ (M)', 45000, 100, N'foods/popcorn-m.jpg', N'Bắp rang bơ size M thơm ngon', 1),
(N'Bắp rang bơ (L)', 55000, 100, N'foods/popcorn-l.jpg', N'Bắp rang bơ size L thơm ngon', 1),
(N'Coca Cola (M)', 25000, 150, N'foods/coca-m.jpg', N'Coca Cola size M mát lạnh', 1),
(N'Coca Cola (L)', 35000, 150, N'foods/coca-l.jpg', N'Coca Cola size L mát lạnh', 1),
(N'Pepsi (M)', 25000, 150, N'foods/pepsi-m.jpg', N'Pepsi size M mát lạnh', 1),
(N'Pepsi (L)', 35000, 150, N'foods/pepsi-l.jpg', N'Pepsi size L mát lạnh', 1),
(N'Combo 1 - Bắp + Nước', 65000, 50, N'foods/combo1.jpg', N'1 Bắp rang bơ size M + 1 Nước ngọt size M', 1),
(N'Combo 2 - Bắp + 2 Nước', 85000, 50, N'foods/combo2.jpg', N'1 Bắp rang bơ size M + 2 Nước ngọt size M', 1),
(N'Combo 3 - 2 Bắp + 2 Nước', 120000, 50, N'foods/combo3.jpg', N'2 Bắp rang bơ size M + 2 Nước ngọt size M', 1),
(N'Snack Mix', 35000, 80, N'foods/snack-mix.jpg', N'Hỗn hợp snack các loại', 1),
(N'Khoai tây chiên', 40000, 80, N'foods/french-fries.jpg', N'Khoai tây chiên giòn rụm', 1),
(N'Bánh Nachos', 45000, 80, N'foods/nachos.jpg', N'Bánh Nachos giòn tan', 1)
GO

-- Kiểm tra dữ liệu đã thêm
SELECT * FROM food
GO 