-- P3.5 Services backfill candidate: reviewed and tested on disposable PostgreSQL.
-- Manual execution only; never add this file to Prisma migrations or seed hooks.
-- Production execution requires a separate review, backup, and authorization.
-- Run the complete file with an SQL client that stops on errors, for example:
-- psql -X --set=ON_ERROR_STOP=1 --file=20261011_p3_services_backfill.sql
-- The connection must be supplied separately; this file contains no credentials.
-- Only the approved fields of the six guarded Service identities are changed.
-- Other services, content fields, timestamps, and all other tables stay intact.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Lock the target rows before checking identity, retaining locks until COMMIT.
-- The primary key and unique slug constraint make each expected pair unambiguous.
DO $p3_services_precondition$
DECLARE
    matching_identities INTEGER;
    invalid_identities TEXT;
BEGIN
    PERFORM "id"
    FROM public."Service"
    WHERE "id" IN (1, 2, 3, 4, 5, 6)
    ORDER BY "id"
    FOR UPDATE;

    SELECT
        COUNT(*) FILTER (WHERE actual."slug" = expected.slug),
        STRING_AGG(
            FORMAT('%s/%s', expected.id, expected.slug),
            ', ' ORDER BY expected.id
        ) FILTER (WHERE actual."slug" IS DISTINCT FROM expected.slug)
    INTO matching_identities, invalid_identities
    FROM (VALUES
        (1, 'desarrollo-web'),
        (2, 'videojuegos'),
        (3, 'animacion-2d-3d'),
        (4, 'modelado-3d'),
        (5, 'inteligencia-artificial'),
        (6, 'branding-contenido-digital')
    ) AS expected(id, slug)
    LEFT JOIN public."Service" AS actual ON actual."id" = expected.id;

    IF matching_identities <> 6 THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            MESSAGE = FORMAT(
                'P3 Services backfill aborted: expected six ID/slug pairs; missing or mismatched: %s',
                invalid_identities
            );
    END IF;
END;
$p3_services_precondition$;

UPDATE public."Service"
SET "title" = 'Desarrollo Web', "isActive" = TRUE, "sortOrder" = 1
WHERE "id" = 1 AND "slug" = 'desarrollo-web'
  AND ("title", "isActive", "sortOrder")
      IS DISTINCT FROM ('Desarrollo Web', TRUE, 1);

UPDATE public."Service"
SET "title" = 'Modelado y Experiencias 3D', "isActive" = TRUE, "sortOrder" = 2
WHERE "id" = 4 AND "slug" = 'modelado-3d'
  AND ("title", "isActive", "sortOrder")
      IS DISTINCT FROM ('Modelado y Experiencias 3D', TRUE, 2);

UPDATE public."Service"
SET "title" = 'Animación y Contenido Digital', "isActive" = TRUE, "sortOrder" = 3
WHERE "id" = 3 AND "slug" = 'animacion-2d-3d'
  AND ("title", "isActive", "sortOrder")
      IS DISTINCT FROM ('Animación y Contenido Digital', TRUE, 3);

UPDATE public."Service"
SET "isActive" = FALSE
WHERE "id" = 2 AND "slug" = 'videojuegos'
  AND "isActive" IS DISTINCT FROM FALSE;

UPDATE public."Service"
SET "isActive" = FALSE
WHERE "id" = 5 AND "slug" = 'inteligencia-artificial'
  AND "isActive" IS DISTINCT FROM FALSE;

UPDATE public."Service"
SET "isActive" = FALSE
WHERE "id" = 6 AND "slug" = 'branding-contenido-digital'
  AND "isActive" IS DISTINCT FROM FALSE;

-- Verify the approved final state before committing. A failure rolls back all six.
DO $p3_services_postcondition$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM (VALUES
            (1, 'desarrollo-web', 'Desarrollo Web', TRUE, 1),
            (4, 'modelado-3d', 'Modelado y Experiencias 3D', TRUE, 2),
            (3, 'animacion-2d-3d', 'Animación y Contenido Digital', TRUE, 3),
            (2, 'videojuegos', NULL, FALSE, NULL),
            (5, 'inteligencia-artificial', NULL, FALSE, NULL),
            (6, 'branding-contenido-digital', NULL, FALSE, NULL)
        ) AS expected(id, slug, title, active, sort_order)
        JOIN public."Service" AS actual
          ON actual."id" = expected.id AND actual."slug" = expected.slug
        WHERE actual."isActive" IS NOT DISTINCT FROM expected.active
          AND (
              NOT expected.active
              OR (actual."title", actual."sortOrder")
                 IS NOT DISTINCT FROM (expected.title, expected.sort_order)
          )
    ) <> 6 THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            MESSAGE = 'P3 Services backfill aborted: final state verification failed';
    END IF;
END;
$p3_services_postcondition$;

COMMIT;
