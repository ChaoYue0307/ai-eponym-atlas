# Security Policy

## Supported Versions

AI Eponym Atlas is a documentation-focused web project under active
development. Security fixes are applied to the latest version on the `main`
branch.

| Version | Supported |
| --- | --- |
| Latest `main` | Yes |
| Older commits, forks, and unofficial deployments | No |

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability.

1. Use **Security → Report a vulnerability** in this repository if private
   vulnerability reporting is available.
2. Otherwise, contact the repository maintainer privately using the contact
   information on their GitHub profile.
3. If no private contact method is available, open a minimal issue asking the
   maintainer to establish a private channel. Do not include exploit details,
   credentials, personal data, or other sensitive information.

Include, where possible:

- The affected page, file, dependency, or commit
- A concise description of the impact
- Reproduction steps or a proof of concept
- Any conditions required to reproduce the issue
- A suggested mitigation, if known

The maintainer will acknowledge the report, assess its impact, coordinate a
fix, and credit the reporter if requested and appropriate. Please allow a
reasonable remediation period before public disclosure.

## Scope

In scope:

- The source code and GitHub Actions workflows in this repository
- The official GitHub Pages deployment
- Vulnerable runtime dependencies used by the website

Out of scope:

- Third-party websites linked from atlas entries
- Vulnerabilities that affect only unofficial forks or modified deployments
- Social engineering, denial-of-service testing, and automated testing that
  disrupts GitHub or other services

Never test against accounts or data you do not own or have explicit permission
to use.
