 
-- 最终统计结果
WITH
	t AS (
		SELECT
			"name",
			"value",
			COUNT(DISTINCT spu_id) AS spu_count,
			ARRAY_AGG(DISTINCT spu_id) AS spu_ids, -- SPU ID数组
			COUNT(DISTINCT sku_id) AS sku_count,
			ARRAY_AGG(DISTINCT sku_id) AS sku_ids -- SKU ID数组
		FROM
			(
				-- 子查询：展开JSON，拆分spec/color/combo三个维度
				-- 1. 统计 spec 维度
				SELECT
					'spec' AS "name",
					(sku_item ->> 'spec') AS "value",
					id AS spu_id,
					(sku_item ->> 'skuID')::INT AS sku_id
				FROM
					z1_spu,
					jsonb_array_elements(sku_ids::jsonb) AS sku_item
				UNION ALL
				-- 2. 统计 color 维度
				SELECT
					'color' AS "name",
					(sku_item ->> 'color') AS "value",
					id AS spu_id,
					(sku_item ->> 'skuID')::INT AS sku_id
				FROM
					z1_spu,
					jsonb_array_elements(sku_ids::jsonb) AS sku_item
				UNION ALL
				-- 3. 统计 combo 维度
				SELECT
					'combo' AS "name",
					(sku_item ->> 'combo') AS "value",
					id AS spu_id,
					(sku_item ->> 'skuID')::INT AS sku_id
				FROM
					z1_spu,
					jsonb_array_elements(sku_ids::jsonb) AS sku_item
			) AS t
			-- 按维度名称+维度值分组统计
		GROUP BY
			"name",
			"value"
		ORDER BY
			"name",
			"value"
	)
	-- PostgreSQL 纯更新语句：仅更新table_a已存在数据，无新增
UPDATE z1_spu_spec_attribute a
SET
	spu_count = t.spu_count,
	spu_ids = t.spu_ids,
	sku_count = t.sku_count,
	sku_ids = t.sku_ids
FROM
	t
	-- 匹配条件：仅更新 table_a 中已存在的 name+value 组合
WHERE
	a.name = t.name
	AND a.value = t.value;