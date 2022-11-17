var CryptoJS = require('crypto-js');
var config = require('../../config');

class Encryption {
    get encryptMethodLength() {
        var encryptMethod = this.encryptMethod;
        // get only number from string.
        // @link https://stackoverflow.com/a/10003709/128761 Reference.
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

    encrypt(string) {
        var key = config.PRIVATE;
        var iv = CryptoJS.lib.WordArray.random(16);// the reason to be 16, please read on `encryptMethod` property.

        var salt = CryptoJS.lib.WordArray.random(256);
        var iterations = 999;
        var encryptMethodLength = (this.encryptMethodLength/4);// example: AES number is 256 / 4 = 64
        var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength/8), 'iterations': iterations});

        var encrypted = CryptoJS.AES.encrypt(string, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});
        var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

        var output = {
            'ciphertext': encryptedString,
            'iv': CryptoJS.enc.Hex.stringify(iv),
            'salt': CryptoJS.enc.Hex.stringify(salt),
            'iterations': iterations
        };
        console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output))));
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));
    }
}

// var test = new Encription();
// var data = {
//     "username": "patrickTest2",
//     "email": "patrickTest2@hmail.com",
//     "password": "P@ssw0rd",
//     "config": null,
//     "account_type": "USER",
//     "referral_code": null,
//     "status": "ADMIN",
//     "account_status": "EMAIL_VERIFIED",
//     "device": {
//         "model": "iPhone",
//         "unique_code": "4A430306-E907-4C07-857A-64B6A0818340"
//     }
// }

export default Encryption;
// test.encrypt(JSON.stringify(data));