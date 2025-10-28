# 安装 ESP32 开发环境

## 参考

- [ESP-IDF 中文文档](https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/get-started/linux-macos-setup.html#get-started-start-a-project)

## macOS

### 配置环境

1. 安装 `CMake`, `Ninja`, `dfu-util`

   ```bash
   brew install cmake ninja dfu-util
   cmake --version
   ninja --version
   dfu-util --version
   ```

2. 安装 ` ccache`

   ```bash
   brew install ccache
   ccache --version
   ```

3. 安装 `Xcode`

   ```bash
   xcode-select --install
   softwareupdate --install -a
   ```

4. 检查 `python3` 版本

   ```bash
   python3 --version
   ```

5. 创建工作目录

   ```bash
   mkdir -p ~/esp && cd ~/esp
   ```

6. 克隆仓库

   ```bash
   git clone -b v5.5.1 --recursive https://github.com/espressif/esp-idf.git
   ```

7. 设置工具

   ```bash
   cd esp-idf
   pwd # /Users/apple/esp/esp-idf
   ./install.sh esp32s2
   ```

8. 执行 `. ./export.sh` 配置环境变量

9. 检查 `idf.py` 版本

   ```bash
   idf.py --version
   ```

10. VS Code 插件

- [ESP-IDF](https://marketplace.visualstudio.com/items?itemName=espressif.esp-idf-extension)

### Hello World

1. 克隆项目
   ```bash
   cd ~/esp
   cp -r esp-idf/examples/get-started/hello_world .
   ```
