-- P3.5B YORUTSUGI backfill candidate: test locally before any authorized use.
-- Manual execution only; never add this file to Prisma migrations or seed hooks.
-- The connection must be supplied separately; this file contains no credentials.
-- It creates only the approved Project and five canonical ProjectCharacter rows.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Serialize executions of this candidate, including the initial insert where no
-- Project row exists yet and therefore no row-level lock can be acquired.
SELECT pg_advisory_xact_lock(hashtext('kyoru:p3:yorutsugi'));

-- If the slug already exists, its complete initial identity must be compatible.
-- No existing data is rewritten to make an incompatible record appear valid.
DO $p3_yorutsugi_project_precondition$
DECLARE
    existing_project public."Project"%ROWTYPE;
BEGIN
    SELECT *
    INTO existing_project
    FROM public."Project"
    WHERE "slug" = 'yorutsugi'
    FOR UPDATE;

    IF FOUND AND (
        existing_project."title" IS DISTINCT FROM 'YORUTSUGI'
        OR existing_project."shortDescription" IS DISTINCT FROM
           'YORUTSUGI es un manga original de fantasía y acción producido por Kyoru Studio y actualmente en desarrollo.'
        OR existing_project."status" IS DISTINCT FROM 'draft'
        OR existing_project."projectType" IS DISTINCT FROM 'ORIGINAL_PRODUCTION'::public."ProjectType"
        OR existing_project."projectStage" IS DISTINCT FROM 'IN_DEVELOPMENT'::public."ProjectStage"
        OR existing_project."format" IS DISTINCT FROM 'Manga original'
        OR existing_project."genres" IS DISTINCT FROM ARRAY['Fantasía', 'Acción']::TEXT[]
        OR existing_project."featured" IS DISTINCT FROM TRUE
        OR existing_project."sortOrder" IS DISTINCT FROM 1
        OR existing_project."category" IS NOT NULL
        OR existing_project."longDescription" IS NOT NULL
        OR existing_project."coverImageUrl" IS NOT NULL
        OR existing_project."demoUrl" IS NOT NULL
        OR existing_project."repositoryUrl" IS NOT NULL
        OR existing_project."technologies" IS DISTINCT FROM ARRAY[]::TEXT[]
        OR existing_project."publishedAt" IS NOT NULL
        OR existing_project."clientName" IS NOT NULL
        OR existing_project."contribution" IS NOT NULL
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            MESSAGE = 'P3 YORUTSUGI backfill aborted: slug yorutsugi belongs to an incompatible Project';
    END IF;
END;
$p3_yorutsugi_project_precondition$;

INSERT INTO public."Project" (
    "title",
    "slug",
    "shortDescription",
    "status",
    "projectType",
    "projectStage",
    "format",
    "genres",
    "featured",
    "sortOrder",
    "updatedAt"
)
SELECT
    'YORUTSUGI',
    'yorutsugi',
    'YORUTSUGI es un manga original de fantasía y acción producido por Kyoru Studio y actualmente en desarrollo.',
    'draft',
    'ORIGINAL_PRODUCTION'::public."ProjectType",
    'IN_DEVELOPMENT'::public."ProjectStage",
    'Manga original',
    ARRAY['Fantasía', 'Acción']::TEXT[],
    TRUE,
    1,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM public."Project" WHERE "slug" = 'yorutsugi'
);

-- Existing character rows for this Project must be a compatible subset of the
-- five approved identities. Unexpected or conflicting characters abort first.
DO $p3_yorutsugi_characters_precondition$
DECLARE
    yorutsugi_project_id INTEGER;
    incompatible_characters TEXT;
BEGIN
    SELECT "id"
    INTO STRICT yorutsugi_project_id
    FROM public."Project"
    WHERE "slug" = 'yorutsugi'
    FOR UPDATE;

    PERFORM "id"
    FROM public."ProjectCharacter"
    WHERE "projectId" = yorutsugi_project_id
    ORDER BY "id"
    FOR UPDATE;

    SELECT STRING_AGG(
        FORMAT('%s/%s', actual."id", actual."slug"),
        ', ' ORDER BY actual."id"
    )
    INTO incompatible_characters
    FROM public."ProjectCharacter" AS actual
    LEFT JOIN (VALUES
        ('kaena-homusaki', 'Kaena Homusaki', NULL::TEXT, 1),
        ('haruki-fujinori', 'Haruki Fujinori', NULL::TEXT, 2),
        ('rinka-mikazari', 'Rinka Mikazari', 'Rin'::TEXT, 3),
        ('daichi-gebara', 'Daichi Gebara', NULL::TEXT, 4),
        ('mizuki-yemari', 'Mizuki Yemari', NULL::TEXT, 5)
    ) AS expected(slug, name, alias, sort_order)
      ON expected.slug = actual."slug"
    WHERE actual."projectId" = yorutsugi_project_id
      AND (
          expected.slug IS NULL
          OR actual."name" IS DISTINCT FROM expected.name
          OR actual."alias" IS DISTINCT FROM expected.alias
          OR actual."sortOrder" IS DISTINCT FROM expected.sort_order
          OR actual."shortDescription" IS NOT NULL
          OR actual."imageUrl" IS NOT NULL
      );

    IF incompatible_characters IS NOT NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            MESSAGE = FORMAT(
                'P3 YORUTSUGI backfill aborted: incompatible ProjectCharacter rows: %s',
                incompatible_characters
            );
    END IF;
END;
$p3_yorutsugi_characters_precondition$;

INSERT INTO public."ProjectCharacter" (
    "projectId",
    "name",
    "slug",
    "alias",
    "sortOrder",
    "updatedAt"
)
SELECT
    project."id",
    expected.name,
    expected.slug,
    expected.alias,
    expected.sort_order,
    CURRENT_TIMESTAMP
FROM public."Project" AS project
CROSS JOIN (VALUES
    ('kaena-homusaki', 'Kaena Homusaki', NULL::TEXT, 1),
    ('haruki-fujinori', 'Haruki Fujinori', NULL::TEXT, 2),
    ('rinka-mikazari', 'Rinka Mikazari', 'Rin'::TEXT, 3),
    ('daichi-gebara', 'Daichi Gebara', NULL::TEXT, 4),
    ('mizuki-yemari', 'Mizuki Yemari', NULL::TEXT, 5)
) AS expected(slug, name, alias, sort_order)
WHERE project."slug" = 'yorutsugi'
  AND NOT EXISTS (
      SELECT 1
      FROM public."ProjectCharacter" AS actual
      WHERE actual."projectId" = project."id"
        AND actual."slug" = expected.slug
  );

-- Verify exactly one compatible Project and exactly five compatible characters.
DO $p3_yorutsugi_postcondition$
DECLARE
    yorutsugi_project_id INTEGER;
    matching_characters INTEGER;
    total_characters INTEGER;
BEGIN
    SELECT "id"
    INTO STRICT yorutsugi_project_id
    FROM public."Project"
    WHERE "slug" = 'yorutsugi';

    SELECT
        COUNT(*) FILTER (
            WHERE actual."name" IS NOT DISTINCT FROM expected.name
              AND actual."alias" IS NOT DISTINCT FROM expected.alias
              AND actual."sortOrder" IS NOT DISTINCT FROM expected.sort_order
              AND actual."shortDescription" IS NULL
              AND actual."imageUrl" IS NULL
        ),
        COUNT(*)
    INTO matching_characters, total_characters
    FROM public."ProjectCharacter" AS actual
    LEFT JOIN (VALUES
        ('kaena-homusaki', 'Kaena Homusaki', NULL::TEXT, 1),
        ('haruki-fujinori', 'Haruki Fujinori', NULL::TEXT, 2),
        ('rinka-mikazari', 'Rinka Mikazari', 'Rin'::TEXT, 3),
        ('daichi-gebara', 'Daichi Gebara', NULL::TEXT, 4),
        ('mizuki-yemari', 'Mizuki Yemari', NULL::TEXT, 5)
    ) AS expected(slug, name, alias, sort_order)
      ON expected.slug = actual."slug"
    WHERE actual."projectId" = yorutsugi_project_id;

    IF matching_characters <> 5 OR total_characters <> 5 THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            MESSAGE = 'P3 YORUTSUGI backfill aborted: final character verification failed';
    END IF;
END;
$p3_yorutsugi_postcondition$;

COMMIT;
