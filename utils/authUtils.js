import bcrypt from 'bcrypt';
import crypto from 'crypto';


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex"); 
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export {
    hashPassword,
    comparePassword,
    generateResetToken,
    hashToken
}