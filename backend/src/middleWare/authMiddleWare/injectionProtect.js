const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return;

  for (const key in obj) {
    if (
      key.startsWith('$') ||           // prevent keys like "$gt", "$ne"
      key.includes('.')                // prevent keys like "profile.name"
    ) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);        // recursively sanitize nested objects
    }
  }
};

const nosqlSanitizer = (req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
};

export default nosqlSanitizer;
