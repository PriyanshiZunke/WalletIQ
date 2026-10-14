# WalletIQ screenshot checklist

This guide is for capturing genuine screenshots of the running WalletIQ application. Do not use mockups or fabricated UI.

## Capture these views

1. **Dashboard** — show the summary cards and the actual charts visible at a readable browser zoom.
2. **Transactions** — show the transaction list and any available filters.
3. **Budgets** — show budget limits and progress indicators if populated.
4. **AI insights** — show a real generated insight only if the feature works with the configured Gemini key.

## Before capturing

- Run the app locally and sign in using your own local development account.
- Use seeded sample data only in a development database.
- Hide browser tabs or personal notifications if they contain private information.
- Do not expose API keys, tokens, database URLs, email addresses, or other personal data.
- Check that currency, dates, charts, and labels are legible.
- Capture the actual running app; don't manually add fake data to the screenshot.

## Save and add the images

Create this folder in the repository:

```text
docs/screenshots/
```

Use descriptive filenames, for example:

- `dashboard.png`
- `transactions.png`
- `budgets.png`
- `ai-insights.png`

Only include screenshots for pages that you have actually captured and verified. Once committed, reference them in the root README with relative paths, for example:

```markdown
![Screenshot of the WalletIQ dashboard showing its actual summary cards and charts.](docs/screenshots/dashboard.png)
```
