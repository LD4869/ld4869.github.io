-- 库存表一致性检查
SELECT 
  * 
FROM 
  gy_product_warehouse
WHERE 
  stock != normal_stock + abnormal_stock 
  OR total_cost != normal_total_cost+abnormal_total_cost;
