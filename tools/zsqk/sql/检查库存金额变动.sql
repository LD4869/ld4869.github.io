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