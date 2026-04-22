import fs from 'fs';
import path from 'path';

export const auditLogger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | IP: ${req.ip}\n`;
  const logDir = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  fs.appendFile(path.join(logDir, 'audit.log'), logMessage, (err) => {
    if (err) console.error('Failed to write to audit log:', err);
  });
  
  next();
};
