# '"{\"saleState\":true}"' -> '{"saleState":true}'
select present #>> '{}'  from gy_non_standard_log  limit 10;