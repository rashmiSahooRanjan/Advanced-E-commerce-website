import crypto from 'crypto';

export const generateResetPasswordToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiration = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    return {resetToken, hashedToken, tokenExpiration};
}