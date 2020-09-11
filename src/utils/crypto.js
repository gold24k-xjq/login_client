
import CryptoJS from 'crypto-js' //引用AES源码js

const KEY = CryptoJS.enc.Utf8.parse("bc5ab5b9ecda64ae"); //密钥  密码
const IV = CryptoJS.enc.Utf8.parse("27974fc9583fc080");

//加密
const encrypt = (data) => {
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
}
// 解密, 调用该方法时，传入的data是base64的密文
const decrypt = (data) => {

    var decrypted = CryptoJS.AES.decrypt(data, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
}

export default {
    encrypt,
    decrypt
}