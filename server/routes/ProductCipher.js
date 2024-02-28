const express = require("express");
const router = express.Router();

class VigenereCipher {
    constructor(key) {
        this.key = key.toUpperCase();
    }

    encrypt(plaintext) {
        let ciphertext = '';
        for (let i = 0; i < plaintext.length; i++) {
            let plainChar = plaintext[i].toUpperCase();
            let keyChar = this.key[i % this.key.length];
            if (plainChar >= 'A' && plainChar <= 'Z') {
                let shift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
                let encryptedChar = String.fromCharCode(((plainChar.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) + 'A'.charCodeAt(0));
                ciphertext += encryptedChar;
            } else {
                ciphertext += plainChar;
            }
        }
        return ciphertext;
    }

    decrypt(ciphertext) {
        let plaintext = '';
        for (let i = 0; i < ciphertext.length; i++) {
            let cipherChar = ciphertext[i].toUpperCase();
            let keyChar = this.key[i % this.key.length];
            if (cipherChar >= 'A' && cipherChar <= 'Z') {
                let shift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
                let decryptedChar = String.fromCharCode(((cipherChar.charCodeAt(0) - 'A'.charCodeAt(0) - shift + 26) % 26) + 'A'.charCodeAt(0));
                plaintext += decryptedChar;
            } else {
                plaintext += cipherChar;
            }
        }
        return plaintext;
    }
}

class ColumnTranspositionCipher {
    static encrypt(plaintext, key) {
        let encryptedText = '';
        let numColumns = key.length;
        let numRows = Math.ceil(plaintext.length / numColumns);
        let matrix = new Array(numRows).fill('').map(() => new Array(numColumns).fill(''));

        let charIndex = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numColumns; col++) {
                matrix[row][col] = plaintext[charIndex] || '';
                charIndex++;
            }
        }

        for (let col of key) {
            let colIndex = key.indexOf(col);
            for (let row = 0; row < numRows; row++) {
                encryptedText += matrix[row][colIndex];
            }
        }

        return encryptedText;
    }

    static decrypt(ciphertext, key) {
        let decryptedText = '';
        let numColumns = key.length;
        let numRows = Math.ceil(ciphertext.length / numColumns);
        let matrix = new Array(numRows).fill('').map(() => new Array(numColumns).fill(''));

        let rowIndex = 0;
        for (let i = 0; i < ciphertext.length; i++) {
            matrix[rowIndex][i % numColumns] = ciphertext[i];
            if ((i + 1) % numColumns === 0) {
                rowIndex++;
            }
        }

        for (let row = 0; row < numRows; row++) {
            for (let col of key) {
                let colIndex = key.indexOf(col);
                decryptedText += matrix[row][colIndex] || '';
            }
        }

        return decryptedText;
    }
}

router.post('/encrypt', (req, res) => {
    const { key, plaintext } = req.body;
    const vigenereCipher = new VigenereCipher(key);
    const encryptedByVigenere = vigenereCipher.encrypt(plaintext);
    const encryptedByColumn = ColumnTranspositionCipher.encrypt(encryptedByVigenere, key);
    res.json({ encryptedText: encryptedByColumn });
});

router.post('/decrypt', (req, res) => {
    const { key, ciphertext } = req.body;
    const decryptedByColumn = ColumnTranspositionCipher.decrypt(ciphertext, key);
    const vigenereCipher = new VigenereCipher(key);
    const decryptedText = vigenereCipher.decrypt(decryptedByColumn);
    res.json({ decryptedText });
});

module.exports = router;
