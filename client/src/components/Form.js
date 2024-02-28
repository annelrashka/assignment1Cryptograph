import React, { useState } from 'react';
import {
    Button,
    Label,
    Select,
    Textarea,
    TextInput,
    Card
} from 'flowbite-react';
import { MdEnhancedEncryption as Encrypt } from "react-icons/md";
import { BsFillUnlockFill as Decrypt } from "react-icons/bs";
import axios from '../API/axios';
import './Form.css';

function Form () {
    const [method, setMethod] = useState('Vigenere Cipher');
    const [plaintext, setPlaintext] = useState('');
    const [key, setKey] = useState('');
    const [isEncrypt, setIsEncrypt] = useState(false);
    const [isDecrypt, setIsDecrypt] = useState(false);
    const [encryptedData, setEncryptedData] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEncrypt = async () => {
        if (method === 'Vigenere Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/vignere/encrypt', {
                    key: key,
                    plaintext: plaintext
                });
                setEncryptedData(response.data.encryptedText);
                setIsEncrypt(true);
                setIsDecrypt(false);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        } else if (method === 'Extended Vigenere Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/extendedvignere/encrypt', {
                    key: key,
                    plaintext: plaintext
                });
                setEncryptedData(response.data.encryptedText);
                setIsEncrypt(true);
                setIsDecrypt(false);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        } else if (method === 'Playfair Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/playfair/encrypt', {
                    key: key,
                    plaintext: plaintext
                });
                setEncryptedData(response.data.encryptedText);
                setIsEncrypt(true);
                setIsDecrypt(false);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        } else if (method === 'Product Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/product/encrypt', {
                    key: key,
                    plaintext: plaintext
                });
                setEncryptedData(response.data.encryptedText);
                setIsEncrypt(true);
                setIsDecrypt(false);
                setLoading(false);
                
            } catch (error) {
                console.error('Error:', error);
                console.log(key, plaintext);
                setLoading(false);
            }

        }
        else {
            console.log('Method not supported yet');
        }
    };

    const handleDecrypt = async () => {
        if (method === 'Vigenere Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/vignere/decrypt', {
                    key: key,
                    ciphertext: plaintext
                });
                setEncryptedData(response.data.decryptedText);
                setIsEncrypt(false);
                setIsDecrypt(true);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        } else if (method === 'Extended Vigenere Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/extendedvignere/decrypt', {
                    key: key,
                    ciphertext: plaintext
                });
                setEncryptedData(response.data.decryptedText);
                setIsEncrypt(false);
                setIsDecrypt(true);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        } else if (method === 'Playfair Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/playfair/decrypt', {
                    key: key,
                    ciphertext: plaintext
                });
                setEncryptedData(response.data.decryptedText);
                setIsEncrypt(false);
                setIsDecrypt(true);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        } else if (method === 'Product Cipher') {
            try {
                setLoading(true);
                const response = await axios.post('/product/decrypt', {
                    key: key,
                    ciphertext: plaintext
                });
                setEncryptedData(response.data.decryptedText);
                setIsEncrypt(false);
                setIsDecrypt(true);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }

        }
        else {
            console.log('Method not supported yet');
        }
    };

    return (
        <Card className="card">
            <h1 className="text-2xl font-bold">Tugas 1 Kriptografi dan Koding</h1>
            <div className="text-m text-gray-400">
                Annel Rashka Perdana - 18220026
            </div>
            <div className="max-w-md">
                <div className="mb-2 block">
                    <Label htmlFor="method" value="Select Method" />
                </div>
                <Select id="method" value={method} onChange={(e) => setMethod(e.target.value)} required>
                    <option value="Vigenere Cipher">Vigenere Cipher</option>
                    <option value="Extended Vigenere Cipher">Extended Vigenere Cipher</option>
                    <option value="Playfair Cipher">Playfair Cipher</option>
                    <option value="Product Cipher">Product Cipher</option>
                </Select>
            </div>
            <div className="max-w-md">
                <div className="mb-2 block">
                    <Label htmlFor="plaintext" value="Plaintext / Ciphertext" />
                </div>
                <Textarea id="plaintext" value={plaintext} onChange={(e) => setPlaintext(e.target.value)} placeholder="Plaintext..." required rows={4} />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="key" value="Key" />
                </div>
                <TextInput id="key" value={key} onChange={(e) => setKey(e.target.value)} type="text" sizing="sm" />
            </div>
            <div className="flex flex-wrap gap-4">
                <Button onClick={handleEncrypt} disabled={loading}>
                    {loading ? 'Loading...' : (
                        <>
                            <Encrypt className="mr-2 h-5 w-5" />
                            Encrypt
                        </>
                    )}
                </Button>
                <Button onClick={handleDecrypt} disabled={loading}>
                    {loading ? 'Loading...' : (
                        <>
              <Decrypt className="mr-2 h-5 w-5" />
                    Decrypt
                        </>
                    )}
                </Button>
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="encryptedData" value={isEncrypt ? "Encrypted Data" : isDecrypt ? "Decrypted Data" : "Choose to Encrypt or Decrypt"} />
                </div>
                <Textarea id="encryptedData" value={encryptedData} readOnly rows={4} />
            </div>
            <Button onClick={() => setEncryptedData('')}> Clear </Button>
        </Card>
    );
}

export default Form;
