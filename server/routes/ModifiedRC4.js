const express = require("express");
const router = express.Router();
const ExtendedVigenereCipher = require("./ExtendedVignereCipher");

class ModifiedRC4 {
    constructor(key) {
        this.key = key;
    }

    // Key-scheduling algorithm (KSA)
    ksa() {
        let keyLength = this.key.length;
        let S = new Array(256);
        let key = [];

        for (let i = 0; i < 256; i++) {
            S[i] = i;
            key.push(this.key.charCodeAt(i % keyLength));
        }

        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + S[i] + key[i]) % 256;
            let temp = S[i];
            S[i] = S[j];
            S[j] = temp;
        }

        return S;
    }

    // Pseudo-random generation algorithm (PRGA)
    prga(S, plaintext) {
        let i = 0;
        let j = 0;
        let ciphertext = '';

        for (let k = 0; k < plaintext.length; k++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            let temp = S[i];
            S[i] = S[j];
            S[j] = temp;

            let K = S[(S[i] + S[j]) % 256];
            let encryptedChar = String.fromCharCode((plaintext.charCodeAt(k) + K) % 256);
            ciphertext += encryptedChar;
        }

        return ciphertext;
    }

    encrypt(plaintext) {
        let S = this.ksa();
        let encryptedWithRC4 = this.prga(S, plaintext);
        
        // combine extended vigenere cipher
        let cipher = new ExtendedVigenereCipher(this.key);
        return cipher.encrypt(encryptedWithRC4);
    }

    decrypt(ciphertext) {
        // decrypt using extended vigenere cipher
        let cipher = new ExtendedVigenereCipher(this.key);
        let decryptedWithVigenere = cipher.decrypt(ciphertext);
    
        // decrypt using rc4
        let S = this.ksa();
        let decryptedWithRC4 = this.prga(S, decryptedWithVigenere);
    
        return decryptedWithRC4;
    }
}

router.post('/encrypt', (req, res) => {
    const { key, plaintext } = req.body;
    const cipher = new ModifiedRC4(key);
    const encryptedText = cipher.encrypt(plaintext);
    res.json({ encryptedText });
});

router.post('/decrypt', (req, res) => {
    const { key, ciphertext } = req.body;
    const cipher = new ModifiedRC4(key);
    const decryptedText = cipher.decrypt(ciphertext);
    res.json({ decryptedText });
});

module.exports = router;
