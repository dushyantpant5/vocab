# Database Migration & Stored Procedure Change Guidelines

This document explains the workflow and naming conventions for making changes to stored procedures (functions) and managing migration files in this repository.

---

## Why follow this process?

- Ensure consistent and traceable database changes.
- Avoid conflicts between function definitions and migration scripts.
- Keep the codebase maintainable and deployable.

---

## How to create or update a stored procedure

### Step 1: Generate a new migration file

Generate an empty migration script using the Supabase CLI:

```bash
npx supabase migration new <migration_name>
```

### Step 2: Naming the migration file

The migration*name must follow this pattern: <action>*<stored*procedure_name>*<description>

<action>: One of add, update, or delete (case-sensitive).

<stored_procedure_name>: Exact name of the stored procedure/function (case-sensitive).

<description>: Brief description of the change, all lowercase and words separated by underscores.

This will generate a migration file like this :

```bash
[timestamp]_<action>_<stored_procedure_name>_<description>.sql
```

### Step 3: Naming the migration file

Copy the complete SQL definition of the stored procedure from the supabase/functions/ folder into the migration file.

Make sure the migration file reflects the intended changes fully and exactly.

This keeps the migration and function definition synchronized.

The stored proc and migration file should be exact same

### Step 4: Naming the migration file

Commit both the updated function file and the new migration file.

Raise a PR with these changes.

The automated CI checks will validate your changes for naming, presence, and content matching.
