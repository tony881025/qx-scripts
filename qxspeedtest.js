// Quantumult X 手动测速脚本
// 轻量版测速，下载固定文件，输出 KB/s

const url = "https://speed.hetzner.de/100MB.bin"; // 测试文件，可换成其他 CDN
const startTime = Date.now();
let receivedBytes = 0;

fetch(url, {method: "GET"})
.then(res => {
    const reader = res.body.getReader();
    function readChunk() {
        return reader.read().then(({done, value}) => {
            if (done) {
                const endTime = Date.now();
                const seconds = (endTime - startTime) / 1000;
                const speedKBs = (receivedBytes / 1024 / seconds).toFixed(2);
                const msg = `测速完成：${speedKBs} KB/s`;
                console.log(msg);
                $notify("节点测速结果", "", msg);
                return;
            }
            receivedBytes += value.length;
            return readChunk();
        });
    }
    return readChunk();
})
.catch(err => {
    console.log("测速失败：" + err);
    $notify("节点测速结果", "", "测速失败：" + err);
});
