
var CryptoJS = require('crypto-js');
global.atob = require("atob");
var config = require('../../config');

var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

class Decryption {
    
    hex_to_ascii(parameter) {
        var str1 = parameter
        var hex = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }
    
    decrypt(parameter) {
        var hex = hex_to_ascii(parameter)
        var encrypted = atob(hex)
        var decrypted = JSON.parse(CryptoJS.AES.decrypt(encrypted, config.SECRET, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
    
        return decrypted;
    }
}

export default Decryption;
