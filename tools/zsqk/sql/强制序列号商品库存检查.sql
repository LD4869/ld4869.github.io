WITH
	g AS (
		SELECT
			product,
			warehouse,
			count(1)
		FROM
			gy_goods
		WHERE
			"state" NOT IN (2, 21, 4)
		GROUP BY
			product,
			warehouse
	)
SELECT
	p.product_name AS "商品名称",
	w."name" AS "仓库名称",
	g.count AS "货品表统计数量",
	pw.stock AS "仓库表统计数量",
	g.count - pw.stock AS "差异数量"
FROM
	g,
	gy_product_warehouse pw,
	lm_product p,
	gy_warehouse w
WHERE
	g.product = pw.product
	AND g.warehouse = pw.warehouse
	AND pw.warehouse = w.id
	AND pw.product = p.product_id
	AND w."name" ~ ''
	AND p.product_name ~ ''
	AND g.count - pw.stock != 0;