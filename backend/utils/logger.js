const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'errors.log');
    this.apiFile = path.join(logsDir, 'api.log');
  }

  writeToFile(filename, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(filename, logMessage, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  }

  log(message, level = 'INFO') {
    const logMessage = `[${level}] ${message}`;
    console.log(logMessage);
    this.writeToFile(this.logFile, logMessage);
  }

  error(message, error = null) {
    const errorMessage = `[ERROR] ${message}${error ? ` - ${error.stack || error.message || error}` : ''}`;
    console.error(errorMessage);
    this.writeToFile(this.errorFile, errorMessage);
  }

  api(endpoint, method, statusCode, responseTime, userId = null) {
    const apiMessage = `[API] ${method} ${endpoint} - Status: ${statusCode} - Time: ${responseTime}ms${userId ? ` - User: ${userId}` : ''}`;
    this.writeToFile(this.apiFile, apiMessage);
  }

  aiApi(provider, prompt, response, error = null) {
    const aiMessage = `[AI-${provider}] ${error ? 'ERROR' : 'SUCCESS'} - Prompt: ${prompt.substring(0, 100)}...${error ? ` - Error: ${error}` : ''}`;
    this.writeToFile(this.apiFile, aiMessage);
  }
}

const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.log(`API call failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key);
    
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
}

const logger = new Logger();
const rateLimiter = new RateLimiter();

module.exports = { logger,retryWithBackoff,rateLimiter}; 