# postgresql

## 安装

### macOS

1. 安装 postgresql

```bash
brew install postgresql
```

2. 启动 postgresql 服务

```bash
brew services start postgresql
```

3. 查看 postgresql 服务状态

```bash
brew services list
```

4. 查看 postgresql 版本

```bash
psql --version
```

## 配置

### macOS

1. 编辑 postgresql 配置文件

   ```bash
   vi /opt/homebrew/var/postgresql@14/postgresql.conf
   ```

   1.1 配置监听地址

   ```bash
   listen_addresses = 'localhost'
   ```

   1.2 配置端口号

   ```bash
   port = 5432
   ```

   1.3 配置最大连接数

   ```bash
   max_connections = 5
   ```

2. 重启 postgresql 服务, 使配置生效

   ```bash
   brew services restart postgresql
   ```

## 创建新用户与数据库

### macOS

1. 查询当前数据库表

   ```bash
   psql -l
   ```

   返回:

   ```
                                    List of databases
      Name    | Owner | Encoding |   Collate   |    Ctype    | Access privileges
   -----------+-------+----------+-------------+-------------+-------------------
    postgres  | apple | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
    template0 | apple | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/apple         +
              |       |          |             |             | apple=CTc/apple
    template1 | apple | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/apple         +
              |       |          |             |             | apple=CTc/apple
   (3 rows)
   ```

2. 使用默认用户打开 postgresql 数据库

   ```bash
   psql -U apple -d postgres
   ```

   返回:

   ```
   psql (14.5)
   Type "help" for help.

   postgres=#
   ```

## 使用图形化工具连接数据库

- TablePlus
