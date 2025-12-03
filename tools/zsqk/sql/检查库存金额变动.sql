-- 查找库存金额变动, 以便找到异常变动
SELECT
	wd.id,
	wd.created_at,
	wd.whse_prod_amount + wd.whse_item_amount - wd.account_amount -
	lag(wd.whse_prod_amount + wd.whse_item_amount - wd.account_amount) 
    OVER (ORDER BY id) as "本次变动值(库存-凭证)" 
FROM
	gy_warehouse_amount_diff AS wd
ORDER BY
	id DESC;

-- 查找凭证中金额, 以便找到异常金额相符的凭证
SELECT
	j.voucher,j.account,sum(amount_cent)
FROM
	cw_voucher v,
	cw_journal_entry j
WHERE
	v.created_at >= 1760251500
	AND v.created_at <= 1760255130
	and v.id = j.voucher
	group by j.voucher,j.account
	;