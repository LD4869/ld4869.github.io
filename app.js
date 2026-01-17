// 日期解析函数
function parseDate(date) {
    date = date ?? new Date();

    const millisecondTimestamp = date.getTime();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dayInWeek = date.getDay();
    const timezoneOffset = date.getTimezoneOffset();

    return {
        date,
        millisecondTimestamp,
        secondTimestamp: millisecondTimestamp / 1000,
        year,
        month,
        day,
        hour,
        minute,
        second,
        dayInWeek: dayInWeek === 0 ? 7 : dayInWeek,
        timezoneOffset: timezoneOffset / 60,
    };
}

// 日期格式化函数
function formatDate(params) {
    const { inputDate = new Date(), separator } = params;
    const { year, month, day, hour, minute, second } = parseDate(inputDate);

    const dateFormat = [
        year,
        month.toString().padStart(2, "0"),
        day.toString().padStart(2, "0"),
    ].join(separator ?? "-");
    const timeFormat = [
        hour.toString().padStart(2, "0"),
        minute.toString().padStart(2, "0"),
        second.toString().padStart(2, "0"),
    ].join(separator ?? ":");

    return {
        fullDateFormat:
            separator !== undefined
                ? [dateFormat, timeFormat].join(separator)
                : `${dateFormat}T${timeFormat}`,
        dateFormat,
        timeFormat,
    };
}

// 获取星期几的中文名称
function getWeekDayName(dayInWeek) {
    const weekDays = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    return weekDays[dayInWeek] || '';
}

// 格式化时区偏移
function formatTimezoneOffset(offset) {
    const sign = offset >= 0 ? '+' : '';
    return `${sign}${offset}小时`;
}

// 更新解析结果显示
function updateParseResult(dateObj) {
    const parsed = parseDate(dateObj);
    
    document.getElementById('originalDate').textContent = parsed.date.toLocaleString('zh-CN');
    document.getElementById('millisecondTimestamp').textContent = parsed.millisecondTimestamp;
    document.getElementById('secondTimestamp').textContent = parsed.secondTimestamp.toFixed(0);
    document.getElementById('year').textContent = parsed.year;
    document.getElementById('month').textContent = parsed.month;
    document.getElementById('day').textContent = parsed.day;
    document.getElementById('hour').textContent = parsed.hour.toString().padStart(2, '0');
    document.getElementById('minute').textContent = parsed.minute.toString().padStart(2, '0');
    document.getElementById('second').textContent = parsed.second.toString().padStart(2, '0');
    document.getElementById('dayInWeek').textContent = `${parsed.dayInWeek} (${getWeekDayName(parsed.dayInWeek)})`;
    document.getElementById('timezoneOffset').textContent = formatTimezoneOffset(parsed.timezoneOffset);
}

// 更新格式化结果显示
function updateFormatResult(dateObj, separator) {
    const formatted = formatDate({ inputDate: dateObj, separator });
    
    document.getElementById('fullDateFormat').textContent = formatted.fullDateFormat;
    document.getElementById('dateFormat').textContent = formatted.dateFormat;
    document.getElementById('timeFormat').textContent = formatted.timeFormat;
}

// 语法高亮函数
function highlightCode(code) {
    return code
        .replace(/\b(function|const|let|var|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|typeof|instanceof|in|of|export|import|from|as|default|class|extends|super|static|public|private|protected|readonly|interface|type|enum|namespace|module|declare|abstract|implements)\b/g, '<span class="keyword">$1</span>')
        .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$&</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
        .replace(/\b(parseDate|formatDate|Date|getTime|getFullYear|getMonth|getDate|getHours|getMinutes|getSeconds|getDay|getTimezoneOffset|toString|padStart|join|toLocaleString)\b/g, '<span class="function">$1</span>')
        .replace(/\b(number|string|boolean|void|any|unknown|never|object|Date)\b/g, '<span class="type">$1</span>');
}

// 显示源代码
function displaySourceCode() {
    const sourceCode = `function parseDate(date?: Date) {
    console.log('Hello')
}`;

    document.getElementById('codeDisplay').innerHTML = highlightCode(sourceCode);
}

// 复制代码功能
function copyCode() {
    const codeElement = document.getElementById('codeDisplay');
    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // 显示复制成功提示
    showNotification('代码已复制到剪贴板！');
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-success';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 初始化应用
function initApp() {
    const dateInput = document.getElementById('dateInput');
    const useNowBtn = document.getElementById('useNowBtn');
    const separatorInput = document.getElementById('separatorInput');
    const formatBtn = document.getElementById('formatBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    
    // 设置当前时间为默认值
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    dateInput.value = localDateTime;
    
    // 初始化显示
    updateParseResult(now);
    updateFormatResult(now, separatorInput.value || undefined);
    displaySourceCode();
    
    // 事件监听器
    dateInput.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        updateParseResult(selectedDate);
        updateFormatResult(selectedDate, separatorInput.value || undefined);
    });
    
    useNowBtn.addEventListener('click', () => {
        const currentNow = new Date();
        const currentLocalDateTime = new Date(currentNow.getTime() - currentNow.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        dateInput.value = currentLocalDateTime;
        updateParseResult(currentNow);
        updateFormatResult(currentNow, separatorInput.value || undefined);
    });
    
    separatorInput.addEventListener('input', (e) => {
        const currentDate = new Date(dateInput.value);
        updateFormatResult(currentDate, e.target.value || undefined);
    });
    
    formatBtn.addEventListener('click', () => {
        const currentDate = new Date(dateInput.value);
        updateFormatResult(currentDate, separatorInput.value || undefined);
        showNotification('日期格式化完成！');
    });
    
    copyCodeBtn.addEventListener('click', copyCode);
    
    // 每秒更新一次当前时间显示（如果使用当前时间）
    setInterval(() => {
        if (dateInput.value) {
            const currentInputDate = new Date(dateInput.value);
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            
            // 如果输入框的时间与当前时间相差在1秒内，则更新显示
            if (Math.abs(currentInputDate.getTime() - now.getTime()) < 1000) {
                updateParseResult(now);
                updateFormatResult(now, separatorInput.value || undefined);
            }
        }
    }, 1000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);
