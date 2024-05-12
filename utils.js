const fs = require("fs");
const path = require("path");

/** 休息 */
function sleep(min = 3, max = 10) {
  const randomDelay = Math.floor(Math.random() * (max - min + 1) + min);

  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * randomDelay);
  });
}

/** 寻找ssr页面中的初始化数据 */
function extractSSRData(html) {
  const start = html.indexOf("window._SSR_INITIAL_DATA = ");
  if (start !== -1) {
    const end = html.indexOf(";", start);
    if (end !== -1) {
      const jsonString = html.slice(start + 27, end);
      return JSON.parse(jsonString.replace(/undefined/g, '""'));
    }
  }
  return null;
}

/** 读取并写入文件 */
function readAndWriteFile(formatData) {
  // 读取 JSON 文件
  fs.readFile(path.join(__dirname, "result.json"), "utf8", (err, data) => {
    let jsonData;
    if (err) {
      jsonData = [formatData];
    } else {
      try {
        jsonData = JSON.parse(data);
        console.log(jsonData);
        // 添加一项
        jsonData.push(formatData);
      } catch (e) {
        console.error("无效的 JSON 格式");
        return;
      }
    }

    // 写入文件
    fs.writeFile(
      path.join(__dirname, "result.json"),
      JSON.stringify(jsonData),
      (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          console.log("写入成功");
        }
      }
    );
  });
}

exports.sleep = sleep;
exports.extractSSRData = extractSSRData;
exports.readAndWriteFile = readAndWriteFile;
