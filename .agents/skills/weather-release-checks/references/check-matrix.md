# Check Matrix

| Change                     | Required checks                                            |
| -------------------------- | ---------------------------------------------------------- |
| Documentation only         | `npm run format:check`                                     |
| Narrow component styles    | Focused test, typecheck, format check                      |
| Component behavior         | Focused component/App tests, `npm run validate`            |
| Store, API, or persistence | Focused unit and App tests, `npm run validate`, coverage   |
| Dependencies               | Install, validation, deprecated check, audit, build        |
| Public assets or manifest  | Format check, build                                        |
| Vite or deployment         | Validation, build, review `/Weather/` paths                |
| Before commit or push      | Diff review, format check, validation, clean staging scope |

## Windows Notes

- If PowerShell blocks `npm.ps1`, invoke the active `npm.cmd`.
- Treat an exact test timeout as potentially transient only after rerunning the
  focused test; rerun the full validation before publishing.
- Git writes to `.git` may require workspace approval.

## Coverage Thresholds

- Statements: 90%
- Functions: 90%
- Lines: 90%
- Branches: 90%
