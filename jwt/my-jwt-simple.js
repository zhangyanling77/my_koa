const crypto = require('crypto')

// 将字符串转换成base64
function stringToBase64(str) {
    return Buffer.from(str).toString('base64');
}

// 将base64转换成字符串
function base64ToString(base64) {
    return Buffer.from(base64, 'base64').toString('utf8');
}

// 生成签名
function createSign(str, secret) {
    // 使用加盐算法进行加密
    return crypto.createHmac('sha256', secret).update(str).digest('base64');
}

// 加密
function encode (payload, secret) {
    // 头部
    let header = stringToBase64(JSON.stringify({
        type: 'JWT',
        alg: 'HS256'
    }));

    // 负载
    let content = stringToBase64(JSON.stringify(payload));

    // 签名
    let sign = createSign([header, content].join('.'), secret);

    // 生成签名
    return [header, content, sign].join('.');
}

// 解密
function decode (token, secret) {
    let [header, content, sign] = token.split('.');
    // 将接收到的token的前两部分（base64）重新签名并验证，验证不通过抛出错误
    if(sign !== createSign([header, content].join('.'), secret)) {
        throw new Error('Not Allow');
    }
    // 将content转成对象
    content = JSON.parse(base64ToString(content));
    // 检测过期时间，如果过期抛出错误
    if(content.exp && content.exp < Date.now()) {
        throw new Error('Not Allow');
    }

    return content;
}


module.exports = {
    encode,
    decode
}