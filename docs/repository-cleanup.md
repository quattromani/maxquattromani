# Private-record history cleanup

On October 19, 2026, the owner authorized a private backup and removal of the entire Documents directory from all personal-repository history. An owner-only local backup preserves the original files and Git history outside this repository. Do not upload that backup or merge old history back into this repository.

All three remote branches were rewritten using git-filter-repo 2.47.0. No tags or forks were present. The removed paths and recorded objects were verified absent from the sanitized local history. Documents is now ignored to prevent accidental reintroduction.

## GitHub Support cleanup requested

Repository: quattromani/maxquattromani. Two affected pull requests: #1 and #2. First changed commit: 5da1a3f1ed9a1f61417a885ead92f09aff88b55c. No Git LFS objects were in use.

Ask GitHub Support to remove the old pull-request references and cached views and run server-side garbage collection for the exposed private financial, tax, payroll, and legal records. Do not attach the records themselves. Rewriting branches does not prove that old objects have been expunged from GitHub storage or other people's clones.

Any other clone must be replaced with a fresh clone or explicitly sanitized before pushing. Do not merge or push an old branch, bundle, or backup.

GitHub Support request #4877351 was submitted on October 19, 2026, from the signed-in owner account. The portal confirmed successful submission and showed the ticket as Open: https://help.github.com/ticket/personal/0/4877351. No private records were attached. Purge completion remains pending Support confirmation.
