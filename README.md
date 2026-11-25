# testweb

A free, open-source personal profile website inspired by guns.lol and fakecrime.bio.
Feel free to adapt it.

## Cloudflare Pages deployment

This is a static HTML site and requires no build command. When connecting the repository to Cloudflare Pages:

- Set the root directory to `QauntumBoa-guns.lol-style-profile`.
- Leave the build command empty and set the output directory to `.`.
- Add your domain as a Pages custom domain and enable [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/).
- Enable [DNSSEC](https://developers.cloudflare.com/dns/dnssec/) after the domain is active on Cloudflare. If DNSSEC is already enabled at your registrar, follow Cloudflare's migration instructions before changing nameservers.
- Enable the [managed WAF rules](https://developers.cloudflare.com/waf/managed-rules/) available on your plan and review Security Events for false positives.
- Enable MFA or passkeys on your Cloudflare account.
- Enable HSTS only after HTTPS is verified; use `includeSubDomains` only if every subdomain supports HTTPS.

The [`_headers` file](https://developers.cloudflare.com/pages/configuration/headers/) applies baseline security headers to static responses. A strict Content Security Policy is not set because this site uses inline styles and scripts and several external services; test a policy in report-only mode before enforcing it.

Turnstile is not included because the site has no form or server endpoint. If a form is added later, [validate tokens server-side](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) in a Worker and keep the secret in Worker secrets, not in this repository.

