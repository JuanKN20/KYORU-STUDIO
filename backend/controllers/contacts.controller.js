const crypto = require('crypto');
const { prisma } = require('../db');

const ALLOWED_CONTACT_STATUSES = new Set(['new', 'in_progress', 'resolved', 'archived']);
const CONTACT_LIMITS = Object.freeze({
  name: { min: 1, max: 140 },
  email: { min: 3, max: 254 },
  phone: { max: 80 },
  subject: { max: 180 },
  message: { min: 20, max: 5_000 },
});
const DUPLICATE_WINDOW_MS = 5 * 60 * 1_000;
const MAX_RECENT_FINGERPRINTS = 10_000;
const recentContactFingerprints = new Map();
let fingerprintReservationCount = 0;

function parseId(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function validationError(fieldName, message) {
  const error = new Error(`${fieldName} ${message}`);
  error.status = 400;
  error.code = 'CONTACT_VALIDATION_ERROR';
  return error;
}

function normalizeOptionalText(value, fieldName, limits) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw validationError(fieldName, 'must be a string');
  }

  const text = value.trim();
  if (text.length > limits.max) {
    throw validationError(fieldName, `must not exceed ${limits.max} characters`);
  }

  return text.length > 0 ? text : null;
}

function normalizeRequiredText(value, fieldName, limits) {
  if (value === undefined || value === null) {
    throw validationError(fieldName, 'is required');
  }

  if (typeof value !== 'string') {
    throw validationError(fieldName, 'must be a string');
  }

  const text = value.trim();
  if (!text) {
    throw validationError(fieldName, 'is required');
  }

  if (text.length < limits.min) {
    throw validationError(fieldName, `must contain at least ${limits.min} characters`);
  }

  if (text.length > limits.max) {
    throw validationError(fieldName, `must not exceed ${limits.max} characters`);
  }

  return text;
}

function normalizeEmail(value) {
  const email = normalizeRequiredText(value, 'email', CONTACT_LIMITS.email).toLowerCase();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    throw validationError('email', 'is invalid');
  }

  return email;
}

function normalizeContactStatus(value) {
  const status = String(value || '').trim().toLowerCase();

  if (!ALLOWED_CONTACT_STATUSES.has(status)) {
    const error = new Error('Invalid contact status');
    error.status = 400;
    throw error;
  }

  return status;
}

function pruneRecentFingerprints(now) {
  fingerprintReservationCount += 1;
  const shouldSweep = fingerprintReservationCount % 100 === 1;

  if (shouldSweep) {
    for (const [fingerprint, entry] of recentContactFingerprints) {
      if (entry.expiresAt <= now) {
        recentContactFingerprints.delete(fingerprint);
      }
    }
  }

  while (recentContactFingerprints.size >= MAX_RECENT_FINGERPRINTS) {
    const oldestFingerprint = recentContactFingerprints.keys().next().value;
    if (oldestFingerprint === undefined) break;
    recentContactFingerprints.delete(oldestFingerprint);
  }
}

function persistContactOnce(contact) {
  const now = Date.now();
  pruneRecentFingerprints(now);

  const fingerprint = crypto
    .createHash('sha256')
    .update(
      JSON.stringify([
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
      ]),
    )
    .digest('hex');
  const existingEntry = recentContactFingerprints.get(fingerprint);

  if (existingEntry && existingEntry.expiresAt > now) {
    return existingEntry.persistence;
  }

  const entry = {
    expiresAt: now + DUPLICATE_WINDOW_MS,
    persistence: null,
  };

  entry.persistence = Promise.resolve()
    .then(() => prisma.contact.create({ data: contact }))
    .then(() => {
      entry.expiresAt = Date.now() + DUPLICATE_WINDOW_MS;
    })
    .catch((error) => {
      if (recentContactFingerprints.get(fingerprint) === entry) {
        recentContactFingerprints.delete(fingerprint);
      }
      throw error;
    });

  recentContactFingerprints.set(fingerprint, entry);
  return entry.persistence;
}

function sendContactAccepted(res) {
  return res.status(201).json({
    ok: true,
    message: 'Contact message received',
  });
}

function mapContact(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

async function createContact(req, res, next) {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw validationError('body', 'must be a JSON object');
    }

    const name = normalizeRequiredText(payload.name, 'name', CONTACT_LIMITS.name);
    const email = normalizeEmail(payload.email);
    const message = normalizeRequiredText(payload.message, 'message', CONTACT_LIMITS.message);
    const phone = normalizeOptionalText(payload.phone, 'phone', CONTACT_LIMITS.phone);
    const subject = normalizeOptionalText(payload.subject, 'subject', CONTACT_LIMITS.subject);

    const contact = {
      name,
      email,
      phone,
      subject,
      message,
    };
    await persistContactOnce(contact);

    return sendContactAccepted(res);
  } catch (error) {
    return next(error);
  }
}

async function getAdminContacts(req, res, next) {
  try {
    const requestedStatus = req.query.status;
    const where = {};

    if (requestedStatus !== undefined) {
      where.status = normalizeContactStatus(requestedStatus);
    }

    const rows = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ ok: true, data: rows.map(mapContact) });
  } catch (error) {
    return next(error);
  }
}

async function updateContactStatus(req, res, next) {
  try {
    const contactId = parseId(req.params.id);
    if (!contactId) {
      return res.status(400).json({ ok: false, error: 'Invalid contact id' });
    }

    const status = normalizeContactStatus(req.body?.status);

    const row = await prisma.contact.update({
      where: { id: contactId },
      data: { status },
    });

    return res.json({ ok: true, data: mapContact(row) });
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }
    return next(error);
  }
}

module.exports = {
  createContact,
  getAdminContacts,
  updateContactStatus,
};
