import crypto from "crypto";

const key = Buffer.from(process.env.ENCRPTION_KEY || "", "hex").slice(0, 32);
const iv = Buffer.from(process.env.ENCRPTION_IV || "", "hex").slice(0, 16);
if (!key) {
  throw new Error("ENCRPTION_KEY is missing");
}
if(!iv){
    throw new Error("ENCRPTION_IV is missing");
}
export {key,iv}

export function decrypt(encrypted: string, key: Buffer<ArrayBuffer>,iv: Buffer<ArrayBuffer>) {
  const algorithm = "aes-256-cbc"
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function encrypt(text: string, key: Buffer<ArrayBuffer> , iv: Buffer<ArrayBuffer>) {
  const algorithm = "aes-256-cbc";

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}
