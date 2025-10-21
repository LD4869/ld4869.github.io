# PostgreSQL

## 数据库

### 创建数据库

```bash
# 创建数据库 mydb
createdb mydb
```

### 删除数据库

```bash
# 删除数据库 mydb
dropdb mydb
```

### 查询数据库

```bash
# 查询数据库
psql -l
```

### 连接数据库

```bash
# 连接数据库 mydb
psql mydb
```

### 退出数据库连接

```bash
# 退出数据库连接
\q
```

## 数据表

### 创建数据表

```bash
# 创建数据表 weather
CREATE TABLE weather (
    city text,
    temp_lo int,
    temp_hi int,
    prcp real,
    date date
);
```

### 查看数据表列表

```bash
# 查看数据表列表
\dt
```

### 查看数据表 weather 的结构

```bash
# 查看数据表结构
\d weather
```

### 删除数据表

```bash
# 删除数据表 weather
DROP TABLE weather;
```

## 数据操作

### 插入数据

```bash
# 插入数据
INSERT INTO weather (city, temp_lo, temp_hi, prcp, date)
VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
```

### 查询数据

```bash
# 查询数据
SELECT * FROM weather;
```

### 删除数据

```bash
# 删除数据
DELETE FROM weather;
```
