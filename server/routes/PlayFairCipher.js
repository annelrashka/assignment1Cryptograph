
const express = require("express");
const router = express.Router();

class PlayfairCipher {
    constructor(key) {
        this.key = key.toUpperCase();
        this.matrix = this.generateMatrix();
    }

    generateMatrix() {
        const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // Skip 'J' 
        let matrix = [];

        // Initialize matrix
        for (let i = 0; i < 5; i++) {
            matrix.push([]);
            for (let j = 0; j < 5; j++) {
                matrix[i].push('');
            }
        }

        let keyIndex = 0;
        let keySet = new Set();

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (keyIndex < this.key.length) {
                    if (this.key[keyIndex] === 'J') {
                        keyIndex++;
                    }
                    if (!keySet.has(this.key[keyIndex])) {
                        matrix[i][j] = this.key[keyIndex];
                        keySet.add(this.key[keyIndex]);
                    } else {
                        j--; 
                    }
                    keyIndex++;
                } else {
                    for (let ch of alphabet) {
                        if (!keySet.has(ch)) {
                            matrix[i][j] = ch;
                            keySet.add(ch);
                            break;
                        }
                    }
                }
            }
        }

        return matrix;
    }

    preprocess(plaintext) {
        return plaintext.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    }

    adjustText(plaintext) {
        let adjustedText = '';
        for (let i = 0; i < plaintext.length; i++) {
            adjustedText += plaintext[i];
            if (plaintext[i] === plaintext[i + 1]) {
                adjustedText += 'X';
            }
        }
        if (adjustedText.length % 2 !== 0) {
            adjustedText += 'X';
        }
        return adjustedText;
    }

    encryptPair(pair) {
        const [a, b] = pair;
        let [aRow, aCol] = this.findPosition(a);
        let [bRow, bCol] = this.findPosition(b);

        if (aRow === bRow) {
            aCol = (aCol + 1) % 5;
            bCol = (bCol + 1) % 5;
        } else if (aCol === bCol) {
            aRow = (aRow + 1) % 5;
            bRow = (bRow + 1) % 5;
        } else {
            const temp = aCol;
            aCol = bCol;
            bCol = temp;
        }

        return this.matrix[aRow][aCol] + this.matrix[bRow][bCol];
    }

    decryptPair(pair) {
        const [a, b] = pair;
        let [aRow, aCol] = this.findPosition(a);
        let [bRow, bCol] = this.findPosition(b);

        if (aRow === bRow) {
            aCol = (aCol - 1 + 5) % 5;
            bCol = (bCol - 1 + 5) % 5;
        } else if (aCol === bCol) {
            aRow = (aRow - 1 + 5) % 5;
            bRow = (bRow - 1 + 5) % 5;
        } else {
            const temp = aCol;
            aCol = bCol;
            bCol = temp;
        }

        return this.matrix[aRow][aCol] + this.matrix[bRow][bCol];
    }

    findPosition(char) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.matrix[i][j] === char) {
                    return [i, j];
                }
            }
        }
    }

    encrypt(plaintext) {
        let adjustedText = this.adjustText(this.preprocess(plaintext));
        let encryptedText = '';

        for (let i = 0; i < adjustedText.length; i += 2) {
            encryptedText += this.encryptPair([adjustedText[i], adjustedText[i + 1]]);
        }

        return encryptedText;
    }

    decrypt(ciphertext) {
        let decryptedText = '';

        for (let i = 0; i < ciphertext.length; i += 2) {
            decryptedText += this.decryptPair([ciphertext[i], ciphertext[i + 1]]);
        }

        return decryptedText;
    }
}

router.post('/encrypt', (req, res) => {
    const { key, plaintext } = req.body;
    const cipher = new PlayfairCipher(key);
    const encryptedText = cipher.encrypt(plaintext);
    res.json({ encryptedText });
});

router.post('/decrypt', (req, res) => {
    const { key, ciphertext } = req.body;
    const cipher = new PlayfairCipher(key);
    const decryptedText = cipher.decrypt(ciphertext);
    res.json({ decryptedText });
});

module.exports = router;
