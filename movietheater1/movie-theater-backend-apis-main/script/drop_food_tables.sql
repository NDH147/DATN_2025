USE movie_theater;
GO

-- Xóa các ràng buộc khóa ngoại trước
ALTER TABLE bill_food DROP CONSTRAINT IF EXISTS FK_bill_food_bill;
ALTER TABLE bill_food DROP CONSTRAINT IF EXISTS FK_bill_food_food;
ALTER TABLE food_order DROP CONSTRAINT IF EXISTS FK_food_order_food;
ALTER TABLE food_order DROP CONSTRAINT IF EXISTS FK_food_order_order;

-- Xóa các bảng
DROP TABLE IF EXISTS bill_food;
DROP TABLE IF EXISTS food_order;
DROP TABLE IF EXISTS food;
GO 