const crypto = require('crypto');

let missingTokenWarningLogged = false;

function tokensMatch(expectedToken, incomingToken) {
  const expectedDigest = crypto.createHash('sha256').update(expectedToken).digest();
  const incomingDigest = crypto.createHash('sha256').update(incomingToken).digest();
  return crypto.timingSafeEqual(expectedDigest, incomingDigest);
}

function adminAuth(req, res, next) {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  const incomingToken = req.header('x-admin-token');

  if (!expectedToken) {
    if (!missingTokenWarningLogged) {
      console.error('[admin-auth] ADMIN_API_TOKEN is not configured');
      missingTokenWarningLogged = true;
    }

    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  if (!incomingToken || !tokensMatch(expectedToken, incomingToken)) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized',
    });
  }

  return next();
}

module.exports = adminAuth;
