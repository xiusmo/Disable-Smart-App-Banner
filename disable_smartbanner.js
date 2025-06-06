/**
 * disable_all_smartbanner.js
 * Surge HTTP Response 脚本：对所有 HTML 页面移除 <meta name="apple-itunes-app"> 标签
 */
(function () {
  const headers = $response.headers || {};
  const contentType = headers["Content-Type"] || headers["content-type"] || "";
  // 只处理 HTML 页面，不干扰其它资源
  if (!/text\/html/i.test(contentType)) {
    $done({});
    return;
  }

  let body = $response.body;
  // 修改 <meta name="apple-itunes-app" 标签中 name 值
  const newBody = body.replace(
    /(<meta\b[^>]*\bname\s*=\s*['"])apple-itunes-app(?=['"][^>]*>)/gi,
    (match, prefix) => prefix + 'apple-itunes-app-disabled'
  );
  // 如果没有找到要删除的，就直接放行
  if (newBody === body) {
    $done({});
    return;
  }

  // 更新 Content-Length（如果有的话）
  const newHeaders = Object.assign({}, headers);
  const lengthKey = newHeaders["Content-Length"]
    ? "Content-Length"
    : newHeaders["content-length"]
    ? "content-length"
    : null;
  if (lengthKey) {
    const byteLength = Buffer.byteLength(newBody, "utf-8");
    newHeaders[lengthKey] = String(byteLength);
  }

  $done({
    headers: newHeaders,
    body: newBody
  });
})();