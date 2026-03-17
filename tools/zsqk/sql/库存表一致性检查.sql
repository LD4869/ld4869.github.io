-- 库存表一致性检查
SELECT 
  * 
FROM 
  gy_product_warehouse
WHERE 
  stock != normal_stock + abnormal_stock 
  OR total_cost != normal_total_cost+abnormal_total_cost;

-- 检查库存表和产品表的成本价格是否匹配
SELECT DISTINCT
	pw.product, -- 产品ID
	p.cost_cent, -- 成本价格
	pw.total_cost / pw.stock as "tcost" -- 库存成本(计算得出)
 FROM
	gy_product_warehouse AS pw,
	lm_product AS p
WHERE
	pw.product = p.product_id
	AND pw.stock * p.cost_cent != pw.total_cost;