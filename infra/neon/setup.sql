-- infra/neon/setup.sql
--
-- One shared Neon database for the demo backends, one schema and one login
-- role per app. Each role owns its schema and can use nothing else.
--
--   schema    role
--   trustit   trustit_app
--   amscars   amscars_app
--   sift      sift_app
--   nexus     nexus_app
--
-- Idempotent: safe to run again. Re-running sets each role's password to the
-- value passed in, so the runner can keep or rotate passwords.
--
-- No secrets live in this file. Passwords arrive as psql variables:
--   psql "$ADMIN_URL" -v ON_ERROR_STOP=1 \
--        -v trustit_pw=... -v amscars_pw=... -v sift_pw=... -v nexus_pw=... \
--        -f setup.sql
-- Use setup.sh, which generates the passwords and writes the app env files.

\set ON_ERROR_STOP on
\set ECHO none
\set QUIET on
SET client_min_messages = warning;

-- Fail early (without echoing anything) if a password variable is missing.
\if :{?trustit_pw}
\else
  \echo 'missing -v trustit_pw'
  \quit 3
\endif
\if :{?amscars_pw}
\else
  \echo 'missing -v amscars_pw'
  \quit 3
\endif
\if :{?sift_pw}
\else
  \echo 'missing -v sift_pw'
  \quit 3
\endif
\if :{?nexus_pw}
\else
  \echo 'missing -v nexus_pw'
  \quit 3
\endif

BEGIN;

-- 1. Roles: create if missing (no password yet), then set attributes and
--    password on every run. (SUPERUSER, REPLICATION and BYPASSRLS default to off;
--    a non-superuser admin may not even mention them.)
SELECT format('CREATE ROLE %I LOGIN', r)
FROM unnest(ARRAY['trustit_app', 'amscars_app', 'sift_app', 'nexus_app']) AS r
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r)
\gexec

SELECT format(
         'ALTER ROLE %I WITH LOGIN NOCREATEDB NOCREATEROLE INHERIT CONNECTION LIMIT 20 PASSWORD %L',
         r, pw)
FROM (VALUES ('trustit_app', :'trustit_pw'),
             ('amscars_app', :'amscars_pw'),
             ('sift_app',    :'sift_pw'),
             ('nexus_app',   :'nexus_pw')) AS v(r, pw)
\gexec

-- The admin role must be a member of each app role to hand it a schema
-- (PostgreSQL 16+ no longer implies this for roles you create).
SELECT format('GRANT %I TO %I', r, current_user)
FROM unnest(ARRAY['trustit_app', 'amscars_app', 'sift_app', 'nexus_app']) AS r
WHERE NOT pg_has_role(current_user, r, 'SET')
\gexec

-- 2. Schemas, each owned by its app role.
CREATE SCHEMA IF NOT EXISTS trustit AUTHORIZATION trustit_app;
CREATE SCHEMA IF NOT EXISTS amscars AUTHORIZATION amscars_app;
CREATE SCHEMA IF NOT EXISTS sift    AUTHORIZATION sift_app;
CREATE SCHEMA IF NOT EXISTS nexus   AUTHORIZATION nexus_app;

-- Ownership is re-asserted in case a schema existed before this script.
ALTER SCHEMA trustit OWNER TO trustit_app;
ALTER SCHEMA amscars OWNER TO amscars_app;
ALTER SCHEMA sift    OWNER TO sift_app;
ALTER SCHEMA nexus   OWNER TO nexus_app;

-- 3. Lock down shared surfaces.
--    Nobody but the database owner may connect unless granted below.
SELECT format('REVOKE ALL ON DATABASE %I FROM PUBLIC', current_database())
\gexec
--    CREATE on the database is needed by Prisma: `migrate deploy` issues
--    CREATE SCHEMA IF NOT EXISTS, and `migrate reset` drops and re-creates the
--    schema. It lets a role create *new* schemas it owns; it gives no access to
--    any schema owned by another role.
SELECT format('GRANT CONNECT, TEMPORARY, CREATE ON DATABASE %I TO %I', current_database(), r)
FROM unnest(ARRAY['trustit_app', 'amscars_app', 'sift_app', 'nexus_app']) AS r
\gexec

--    The public schema is off limits to the app roles.
REVOKE ALL ON SCHEMA public FROM PUBLIC;

--    Each app schema: only its owner. Strip anything granted by hand earlier.
REVOKE ALL ON SCHEMA trustit FROM PUBLIC;
REVOKE ALL ON SCHEMA amscars FROM PUBLIC;
REVOKE ALL ON SCHEMA sift    FROM PUBLIC;
REVOKE ALL ON SCHEMA nexus   FROM PUBLIC;

GRANT USAGE, CREATE ON SCHEMA trustit TO trustit_app;
GRANT USAGE, CREATE ON SCHEMA amscars TO amscars_app;
GRANT USAGE, CREATE ON SCHEMA sift    TO sift_app;
GRANT USAGE, CREATE ON SCHEMA nexus   TO nexus_app;

-- 4. Default privileges: objects an app role creates stay private to it
--    (no grants to PUBLIC on new functions/types).
ALTER DEFAULT PRIVILEGES FOR ROLE trustit_app REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE amscars_app REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE sift_app    REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE nexus_app   REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE trustit_app REVOKE USAGE ON TYPES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE amscars_app REVOKE USAGE ON TYPES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE sift_app    REVOKE USAGE ON TYPES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE nexus_app   REVOKE USAGE ON TYPES FROM PUBLIC;

-- 5. Each role lands in its own schema by default.
ALTER ROLE trustit_app SET search_path = trustit;
ALTER ROLE amscars_app SET search_path = amscars;
ALTER ROLE sift_app    SET search_path = sift;
ALTER ROLE nexus_app   SET search_path = nexus;

-- Demo safety net: no runaway queries on the free tier.
ALTER ROLE trustit_app SET statement_timeout = '30s';
ALTER ROLE amscars_app SET statement_timeout = '30s';
ALTER ROLE sift_app    SET statement_timeout = '30s';
ALTER ROLE nexus_app   SET statement_timeout = '30s';

COMMIT;

-- Names only, no secrets.
\pset tuples_only on
\pset format unaligned
SELECT 'schema ' || n.nspname || ' owner ' || pg_get_userbyid(n.nspowner)
FROM pg_namespace n
WHERE n.nspname IN ('trustit', 'amscars', 'sift', 'nexus')
ORDER BY 1;
