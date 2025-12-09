# Development

Below is a guide for the development and release processes of Synapse. This is meant for Convex employees and is not a supported workflow for external users.

There are three special branches:

- main: default branch, make PRs against this
- staging: what the world sees at [synapse-staging.convex.dev](https://synapse-staging.convex.dev)
- release: what the world sees at [synapse.convex.dev](https://synapse.convex.dev)

### One-time setup

```
git clone git@github.com:get-convex/synapse.git
cd synapse
nvm install
nvm use
npm install -g pnpm
pnpm i
npx vercel link --scope convex-dev --project chef -y
npx vercel env pull
echo 'VITE_CONVEX_URL=placeholder' >> .env.local
npx convex dev --configure existing --team convex --project chef --once
```

# Synapse Development

## Deployment

### Staging

The Synapse staging environment is deployed to Vercel at [synapse-staging.convex.dev](https://synapse-staging.convex.dev). It is automatically deployed on every push to `main`. It uses the `synapse-staging` Convex prod deployment.

To deploy manual changes to the `synapse-staging` Convex deployment:

```bash
npx vercel link --scope convex-dev --project synapse-staging -y
# Set environment variables from the Vercel project...
npx vercel env pull .env.staging
# Deploy to the Convex prod deployment
npx dotenv -e .env.staging -- npx convex deploy
```

### Production

The Synapse production environment is deployed to Vercel at [synapse.convex.dev](https://synapse.convex.dev). It is manually deployed via promotion from staging. It uses the `synapse` Convex prod deployment.

To promote staging to production:
1. Go to the [Vercel dashboard](https://vercel.com/convex-dev/synapse/deployments).
2. Find the latest deployment from `main`.
3. Click "Promote to Production".

To deploy manual changes to the `synapse` Convex deployment:

```bash
npx vercel link --scope convex-dev --project synapse -y
# Set environment variables from the Vercel project...
npx vercel env pull .env.production
# Deploy to the Convex prod deployment
npx dotenv -e .env.production -- npx convex deploy
```

## Local Development

To run Synapse locally against the `synapse-staging` Convex deployment:
```bash
npx convex dev --configure existing --team convex --project synapse-staging --once
```

To run Synapse locally against the `synapse` Convex deployment:
```bash
npx convex dev --configure existing --team convex --project synapse --once
```
(warning: this will connect to the PROD database).

## Release Process

1. QA the staging URL: [synapse-staging.convex.dev](https://synapse-staging.convex.dev).
2. If it looks good, promote the latest deployment to production on Vercel.
   - Go to your PR or push a branch and go to [vercel.com/convex-dev/synapse/deployments](https://vercel.com/convex-dev/synapse/deployments)
   - Click "Promote to Production".
3. Make a PR from staging to release using [go/synapse-release](https://go.cvx.is/synapse-release) and confirm that
   the diff looks correct.
   The evals look good once they run (they should take ~10 mins). All of the evals should have an `isSuccess`
   rate of 100%. (Do NOT merge this PR because the GitHub merge queue doesn't allow fast-forward only merges)
4. Announce in the #project-synapse Slack channel when you do this.

While you're waiting for evals to run, manually test staging.

Merge the staging branch into release using the command below.
Announce in the #project-synapse Slack channel when you do this.

```
git checkout staging
git pull
git push origin staging:release
```

If the change does not include non-backward compatible Convex DB changes you
can use the Vercel instant rollbacks to prompt old deployments to production.

### Auth

- Users sign in with their regular Convex account through WorkOS.
- Users choose a team to create a new project in for app they conconct with Synapse.
  Note that this is _not_ the OAuth flow that we offer to customers; if a customer wants this,
  they need to use the OAuth flow that grants them access to a user's specific Convex project.
- You'll need the following env vars set in `.env.local` (values are in 1Password under `flex .env.local`)
  - VITE_WORKOS_CLIENT_ID=client_01K0YV0SNPRYJ5AV4AS0VG7T1J
  - VITE_WORKOS_REDIRECT_URI=http://127.0.0.1:5173
  - VITE_WORKOS_API_HOSTNAME=apiauth.convex.dev

(it'll also be in the default Convex project env vars, so you can sync via dashboard).

### Developing against local big-brain

You will need a lot of terminals

- just run-big-brain-for-synapse-dev
- just run-dash
- Switch synapse .env.local env vars to the dev variants (from 1Password)
- Set VITE_CONVEX_URL to 'placeholder' and remove CONVEX_URL
- just convex-bb dev
- Set VITE_CONVEX_SITE_URL to match the newly updated VITE_CONVEX_URL (but .convex.site instead)
- npm run dev

# Working on the template

There are a few steps to iterating on the template.

Run `npm run rebuild-template` for directions.

# Debugging

We include source maps in production so you should be able to poke around in production.

There are a few global variables available for debugging too:

- `synapseWebContainer` is the unix-ish container in which tooling and code runs
- `synapseMessages` is the raw messages
- `synapseParsedMessages` is similar
- `synapseSentryEnabled` is whether Sentry is currently enabled
- `synapseSetLogLevel()` can be called with log levels like `"debug"` or `"info"` to get more console logging. `"tracing"` is usually too much.
- `synapseAssertAdmin()` enables admin features (after checking that you are a member of the Convex team in the prod dashboard)
