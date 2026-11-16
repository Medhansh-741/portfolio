
# Update open source from GitHub

PR counts, states, stars, logos and "latest merge" already refresh by themselves (GitHub fetch, every 6h).
Only two things are manual, both in `app/lib/open-source.ts`:

1. **`UPSTREAM`**: which repos count. Add new upstream projects here.
2. **`about` per repo** (and optional **`NOTES`** per PR): one line each, written by hand.

## Steps

1. List repos where he has PRs but which aren't in `UPSTREAM` yet:
   ```bash
   gh search prs --author Medhansh-741 --limit 300 --json repository \
     -q '[.[].repository.nameWithOwner] | unique | .[]'
   ```
   Drop his own repos (`Medhansh-741/*`) and anything already in `UPSTREAM`.
2. For each candidate, check it is real upstream open source, not a team/hackathon repo:
   ```bash
   gh api repos/OWNER/REPO -q '"\(.owner.type) stars=\(.stargazers_count) push=\(.permissions.push)"'
   ```
   Keep it only if `owner.type` is `Organization` **and** `push` is `false`. Known team repos to always skip:
   `AWS-env/*`, `prx-my/*`, `pranikaK17/NyayAI`, `MrPanda009/*`. If unsure, ask him.
3. Add one `UPSTREAM` entry per kept repo: `repo`, `project` (readable name), `org` (repos of the same org share it),
   and `about`: one plain line on what the project does, based on `gh api repos/OWNER/REPO -q .description`.
4. Optional: add a `NOTES["owner/repo#number"]` line only for a standout merged PR, paraphrasing its title. Never invent impact.
5. `npm run build`, open `/` (Open source tab) and `/open-source`, confirm the new repo shows and the deck height is unchanged.
6. Commit with a plain message and **no Co-Authored-By line**. Don't push unless he asks.
