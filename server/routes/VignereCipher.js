const router = require("express").Router();

class VigenereCipher {
    constructor (key) {
        this.key = key.toUpperCase();
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    extendKey (text) {
        let extendedKey = '';
        let keyIndex = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i].match(/[A-Z]/)) {
                extendedKey += this.key[keyIndex % this.key.length];
                keyIndex++;
            } else {
                extendedKey += text[i];
            }
        }
        return extendedKey;
    }

    encrypt (plaintext) {
        plaintext = plaintext.toUpperCase();
        let extendedKey = this.extendKey(plaintext);
        let ciphertext = '';
        for (let i = 0; i < plaintext.length; i++) {
            if (plaintext[i].match(/[A-Z]/)) {
                let plainCharIndex = this.alphabet.indexOf(plaintext[i]);
                let keyCharIndex = this.alphabet.indexOf(extendedKey[i]);
                let encryptedIndex = (plainCharIndex + keyCharIndex) % 26;
                ciphertext += this.alphabet[encryptedIndex];
            } else {
                ciphertext += plaintext[i];
            }
        }
        return ciphertext;
    }

    decrypt (ciphertext) {
        ciphertext = ciphertext.toUpperCase();
        let extendedKey = this.extendKey(ciphertext);
        let plaintext = '';
        for (let i = 0; i < ciphertext.length; i++) {
            if (ciphertext[i].match(/[A-Z]/)) {
                let cipherCharIndex = this.alphabet.indexOf(ciphertext[i]);
                let keyCharIndex = this.alphabet.indexOf(extendedKey[i]);
                let decryptedIndex = (cipherCharIndex - keyCharIndex + 26) % 26;
                plaintext += this.alphabet[decryptedIndex];
            } else {
                plaintext += ciphertext[i];
            }
        }
        return plaintext;
    }
}


router.post('/encrypt', (req, res) => {
    const { key, plaintext } = req.body;
    const cipher = new VigenereCipher(key);
    const encryptedText = cipher.encrypt(plaintext);
    res.json({ encryptedText });
});


router.post('/decrypt', (req, res) => {
    const { key, ciphertext } = req.body;
    const cipher = new VigenereCipher(key);
    const decryptedText = cipher.decrypt(ciphertext);
    res.json({ decryptedText });
});

router.get('/test', (req, res) => {
    res.send('Vigenere Cipher is working');
});
module.exports = router;
