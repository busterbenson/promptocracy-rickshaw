# Rickshaw Game 1

A game of [Promptocracy](https://github.com/busterbenson/promptocracy): nomic with an AI moderator, where changing
the rules is a move.

- `RULES.md` is the rules in effect. Only this file on `main` counts.
- Every passed proposal is a commit, so `git log RULES.md` is the history of the game.
- The board, players and scores live on the Promptocracy site, not in this repo.

The starting rules were copied from Promptocracy's starter ruleset on 2026-11-18.

## Rules as code

Some rules also have code. The text is still the only thing that counts (rule 101), and the code is the rule's
machinery: `rules/<n>.ts` is rule `<n>`'s module, `rules/<n>.test.ts` its tests, `settings.json` the numbers
the text names as `[setting: x]`, and `game.json` lists the modules and the engine version they were written for.
`rules/rulebook.test.ts` checks that the text, the settings and the modules agree.

    npm install    # fetches the platform's engine, for the tests
    npm test

The platform builds a game from its latest `day-N` tag: it fetches the tag, lints the modules (they may import only
`promptocracy/engine`), runs these tests, and bundles the text, settings and modules into the site. Until a `day-N`
tag exists, nothing here changes how the live game plays. While the game is being set up (before day 1), a direct
edit goes live with the next setup tag, `day-0.1`, `day-0.2` and so on; tags are never moved. From day 1 on, only the
moderator's `day-N` tags count.
