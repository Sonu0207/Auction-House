import crypto from 'crypto'

const alg = 'aes-256-cbc'
const buffer16 = [ 119, 30, 153, 253, 109, 87, 174, 74, 92, 36, 218, 132, 113, 109, 95, 183]
const buffer32 = [80, 122, 102, 248, 50, 254, 122, 218, 1, 245, 190, 221, 131, 249, 40, 113, 54, 111, 70, 48, 0, 101, 248, 173, 125, 24, 250, 181, 18, 226, 168, 127]
const secretKey = Buffer.from(buffer32)
const iv = Buffer.from(buffer16)
interface encryptData{
    iv :any,
    encryptedData: any
}

export function encrypt(pass : string){
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(pass);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}


export function decrypt(pass:encryptData){
    let iv = Buffer.from(pass.iv, 'hex');
    let encryptedText = Buffer.from(pass.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}