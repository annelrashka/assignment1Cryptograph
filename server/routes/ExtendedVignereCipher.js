
const express = require("express");
const router = express.Router();



class ExtendedVigenereCipher {
    constructor(key) {
        this.key = key;
    }

    extendKey(length) {
        let extendedKey = '';
        let keyIndex = 0;
        for (let i = 0; i < length; i++) {
            extendedKey += this.key.charCodeAt(keyIndex);
            keyIndex = (keyIndex + 1) % this.key.length;
        }
        return extendedKey;
    }

    encrypt(plaintext) {
        let extendedKey = this.extendKey(plaintext.length);
        let encryptedText = '';
        for (let i = 0; i < plaintext.length; i++) {
            let encryptedChar = String.fromCharCode((plaintext.charCodeAt(i) + extendedKey.charCodeAt(i)) % 256);
            encryptedText += encryptedChar;
        }
        return encryptedText;
    }

    decrypt(ciphertext) {
        let extendedKey = this.extendKey(ciphertext.length);
        let decryptedText = '';
        for (let i = 0; i < ciphertext.length; i++) {
            let decryptedChar = String.fromCharCode((ciphertext.charCodeAt(i) - extendedKey.charCodeAt(i) + 256) % 256);
            decryptedText += decryptedChar;
        }
        return decryptedText;
    }
}


router.post('/encrypt', (req, res) => {
    const { key, plaintext } = req.body;
    const cipher = new ExtendedVigenereCipher(key);
    const encryptedText = cipher.encrypt(plaintext);
    res.json({ encryptedText });
});


router.post('/decrypt', (req, res) => {
    const { key, ciphertext } = req.body;
    const cipher = new ExtendedVigenereCipher(key);
    const decryptedText = cipher.decrypt(ciphertext);
    res.json({ decryptedText });
});

module.exports = router;
module.exports = ExtendedVigenereCipher;