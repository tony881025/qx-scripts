// Quantumult X 手动测速（小文件一次性下载）
const url = "https://speed.hetzner.de/5MB.bin"; // 5MB 文件即可
const startTime = Date.now();

fetch(url)
  .then(res => res.blob())
  .then(blob => {
    const endTime = Date.now();
    const seconds = (endTime - startTime) / 1000;
    const size = blob.size; // 字节数
    const speed = size / seconds; // B/s
    let speedText = "";
    if (speed < 1024) speedText = speed.toFixed(2) + " B/s";
    else if (speed < 1024 * 1024) speedText = (speed / 1024).toFixed(2) + " KB/s";
    else speedText = (speed / 1024 / 1024).toFixed(2) + " MB/s";
    const msg = `测速完成：${speedText}`;
    console.log(msg);
    $notify("节点测速结果", "", msg);
  })
  .catch(err => {
    console.log("测速失败：" + err);
    $notify("节点测速结果", "", "测速失败：" + err);
  });
