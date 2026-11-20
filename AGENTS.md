# AGENTS.md — a Promptocracy game repo (Rickshaw Game 1)

This repo is one game's rules. The platform that runs it is `busterbenson/promptocracy`; read its AGENTS.md for the full context. `CLAUDE.md` imports this file.

- **This repo is the game.** Each rule is text in `RULES.md` + code in `rules/<n>.ts` + tests in `rules/<n>.test.ts`. Tunable numbers are `[setting: key]` in the text and live in `settings.json`.
- **Rules change only by passed proposal** once play starts, applied by the moderator (Chalant) at midnight as one commit per proposal: text + code + tests. Tests must pass or the proposal is not applied, and it goes back to its owner with the reason. Each processed day is tagged `day-N`; the platform deploys the latest tag.
- **The moderator may only touch** `RULES.md`, `settings.json`, `rules/`, `rulings/`.
- **Every rule module function carries `@rule <n>`** naming the rule it implements; the platform's checker fails on unclaimed code or a tag for a rule that doesn't exist.
- Rule code may not make network calls or import anything beyond the engine API.
- While the game is in setup (one player), starter rules may be edited directly to match the platform's starter template.
