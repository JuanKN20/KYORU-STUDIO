function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const proposedStatus = Number(error.statusCode || error.status);
  const status =
    Number.isInteger(proposedStatus) && proposedStatus >= 400 && proposedStatus <= 599
      ? proposedStatus
      : 500;

  let message = status >= 500 ? 'Internal server error' : error.message || 'Request failed';

  if (error.type === 'entity.parse.failed') {
    message = 'Invalid JSON payload';
  } else if (error.type === 'entity.too.large') {
    message = 'Request payload too large';
  } else if (error.code === 'CORS_ORIGIN_DENIED') {
    message = 'Origin is not allowed by the CORS policy';
  }

  if (status >= 500) {
    const metadata = {
      method: req.method,
      path: req.path,
      name: typeof error?.name === 'string' ? error.name : 'Error',
      code: typeof error?.code === 'string' ? error.code : undefined,
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('[error]', metadata, error);
    } else {
      console.error('[error]', metadata);
    }
  }

  return res.status(status).json({
    ok: false,
    error: message,
  });
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    ok: false,
    error: 'Route not found',
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
