// Quantumult X 手动测速脚本
// 支持自动单位换算，带超时保护

const url = "https://speed.hetzner.de/100MB.bin"; // 测速文件，50~100MB就够
const timeout = 15000; // 超时时间，单位 ms
const startTime = Date.now();
let receivedBytes = 0;

let didTimeout = false;

// 超时处理
const timer = setTimeout(() => {
    didTimeout = true;
    const msg = `测速超时，请检查节点或网络`;
    console.log(msg);
    $notify("节点测速结果", "", msg);
}, timeout);

fetch(url, { method: "GET" })
.then(res => {
    if (didTimeout) return;
    const reader = res.body.getReader();

    function readChunk() {
        return reader.read().then(({ done, value }) => {
            if (done) {
                clearTimeout(timer);
                const endTime = Date.now();
                const seconds = (endTime - startTime) / 1000;
                const speed = receivedBytes / seconds; // B/s
                let speedText = "";
                if (speed < 1024) {
                    speedText = speed.toFixed(2) + " B/s";
                } else if (speed < 1024 * 1024) {
                    speedText = (speed / 1024).toFixed(2) + " KB/s";
                } else {
                    speedText = (speed / 1024 / 1024).toFixed(2) + " MB/s";
                }
                const msg = `测速完成：${speedText}`;
                console.log(msg);
                $notify("节点测速结果", "", msg);
                return;
            }
            receivedBytes += value.byteLength; // 用 byteLength 更稳妥
            return readChunk();
        }).catch(err => {
            clearTimeout(timer);
            const msg = "测速失败：" + err;
            console.log(msg);
            $notify("节点测速结果", "", msg);
        });
    }
    return readChunk();
})
.catch(err => {
    clearTimeout(timer);
    const msg = "测速失败：" + err;
    console.log(msg);
    $notify("节点测速结果", "", msg);
});
