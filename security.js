
var CryptoJS = require('crypto-js');
import { decode as atob, encode } from 'base-64'
import config from '../../config.js'

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
    #str_to_decode;

    constructor() {
        this.str_to_decode = null;
    }

    setStringToDecode(string) {
        this.#str_to_decode = string
    }

    hex_to_ascii() {
        var str1 = this.#str_to_decode
        var hex = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

    decrypt() {
        // var hex = this.hex_to_ascii(this.#str_to_decode)
        // var encrypted = atob(hex)
        var hex = this.#str_to_decode, // ASCII HEX: 37="7", 57="W", 71="q"
            bytes = [],
            str;

        for (var i = 0; i < hex.length - 1; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        str = String.fromCharCode.apply(String, bytes);
        var decrypted = JSON.parse(CryptoJS.AES.decrypt(str, config.SECRET, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
        return decrypted;
    }
}

class Encrypt {
    #str_to_hash;

    constructor() {
        this.#str_to_hash = null
    }

    setStringToHash(string) {
        this.#str_to_hash = string;
    }

    get encryptMethodLength() {
        var encryptMethod = this.encryptMethod;
        var aesNumber = encryptMethod.match(/\d+/)[0];
        return parseInt(aesNumber);
    }

    get encryptKeySize() {
        var aesNumber = this.encryptMethodLength;
        return parseInt(aesNumber / 8);
    }

    get encryptMethod() {
        return 'AES-256-CBC';
    }

    encrypt() {
        var key = config.PRIVATE;
        var iv = CryptoJS.lib.WordArray.random(16);// the reason to be 16, please read on `encryptMethod` property.

        var salt = CryptoJS.lib.WordArray.random(256);
        var iterations = 999;
        var encryptMethodLength = (this.encryptMethodLength / 4);// example: AES number is 256 / 4 = 64
        var hashKey = CryptoJS.PBKDF2(key, salt, { 'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength / 8), 'iterations': iterations });

        var encrypted = CryptoJS.AES.encrypt(this.#str_to_hash, hashKey, { 'mode': CryptoJS.mode.CBC, 'iv': iv });
        var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

        var output = {
            'ciphertext': encryptedString,
            'iv': CryptoJS.enc.Hex.stringify(iv),
            'salt': CryptoJS.enc.Hex.stringify(salt),
            'iterations': iterations
        };
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));
    }

}

const Security = {
    EncryptData: (string) => {
        let enc = new Encrypt();
        enc.setStringToHash(string)
        return enc.encrypt()
    },

    DecryptData: (string) => {
        let dec = new Decryption();
        dec.setStringToDecode(string);
        return dec.decrypt()
    }
}




export default Security;
