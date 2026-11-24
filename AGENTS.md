# Repository Operating Rules

- The official repository is `JuanKN20/KYORU-STUDIO`.
- KYORU is the current identity; `AKAI-STUDIO` is historical naming and must not be treated as the active brand.
- Inspect only as broadly as the task requires. Keep each iteration to one reasonable, reviewable scope.
- Preserve unrelated local changes. Do not reset, clean, overwrite, stage, or revert work that is outside the task.
- Never expose, copy, invent, or commit secrets. Do not alter production or external services without explicit authorization.
- Keep frontend, backend, and database work separate unless a verified contract requires a coordinated change.
- The only permanent branches are `main`, `frontend`, and `backend`. Do not create other branches without explicit approval.
- Develop web changes on `frontend` and server and data changes on `backend`. Use Jira to track tickets, sprints, and features; do not create a branch per ticket.
- `main` is the only official integration and production branch. Validate before opening a pull request; prefer merge commits and synchronize the permanent branches after integration without rewriting history or using force push.
- Obtain the project owner's authorization before committing, pushing, merging, or deploying. Stage only authorized files.
- Keep production masters, mockups, and temporary captures outside the Git workspace. Version only approved web assets necessary for the application. Remove verified disposable outputs at the end of each task without discarding unrelated work.
- Run validation proportional to the changed surface and report anything that could not be verified.
- Do not add or update dependencies without a concrete, documented need.

