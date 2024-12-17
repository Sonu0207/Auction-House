import mysql from 'mysql';
import crypto from 'crypto';

const buffer32 = [80, 122, 102, 248, 50, 254, 122, 218, 1, 245, 190, 221, 131, 249, 40, 113, 54, 111, 70, 48, 0, 101, 248, 173, 125, 24, 250, 181, 18, 226, 168, 127];
const secretKey = Buffer.from(buffer32);

let pool;
const getPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });
    }
    return pool;
};

// Decrypt password
function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const encryptedText = Buffer.from(encrypted.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Check if username already exists
const checkUsernameExists = (username) => {
    const pool = getPool();
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM buyerTable WHERE username = ?", [username], (error, rows) => {
            if (error) return reject(error);
            resolve(rows.length > 0);
        });
    });
};

// Create a new buyer account
const createBuyerAccount = (username, decryptedPassword) => {
    const pool = getPool();
    return new Promise((resolve, reject) => {
        let authkey = Math.floor(Math.random() * 1000000000);
        pool.query(
            "INSERT INTO buyerTable (username, password, authkey, totalFunds, availableFunds) VALUES (?, ?, ?, 0, 0)", 
            [username, decryptedPassword, authkey],
            (error) => {
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

// Lambda handler
export const handler = async (event) => {
    let result;

    try {
        const { username, password } = event;

        // Check if username already exists
        const userExists = await checkUsernameExists(username);
        if (userExists) {
            result = {
                statusCode: 400,
                body: JSON.stringify({ message: "Username already exists." })
            };
            return result;
        }

        // Decrypt the password
        const decryptedPassword = decrypt(password);

        // Create new buyer account with the decrypted password
        await createBuyerAccount(username, decryptedPassword);
        result = {
            statusCode: 201,
            body: JSON.stringify({ message: "Account created successfully." })
        };
    } catch (error) {
        console.error(error);
        result = {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }

    return result;
};