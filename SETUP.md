# Running CredChain locally

Secrets are not stored in this repo. Each `.env` file has a `.env.example` next to it showing the variable names you need. Copy it and fill in the values.

## What you need installed

- Node.js 18 or newer
- Python 3.8 or newer
- MongoDB running locally on port 27017 (MongoDB Community Server, or `docker run -d -p 27017:27017 mongo`)
- MetaMask in your browser, set to the Sepolia test network

## 1. Clone and create your env files

```bash
git clone https://github.com/soham200521/CredChain.git
cd CredChain
cp server/.env.example server/.env
```

On Windows, use `copy` instead of `cp`.

Fill in `server/.env`:

| Variable | Where to get it |
|---|---|
| `CONNECTION_STRING` | Leave as `mongodb://localhost:27017/credchain` |
| `KEY` | Make your own: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CLOUDINARY_*` | Ask Soham privately, or make a free Cloudinary account and use your own |
| `ADMIN_1_ID` … `ADMIN_4_PASS` | Pick your own admin logins for your local copy |

You only need the root `.env` and `API/.env` if you are deploying the contract or running `API/blockchain.py`. Running the app, compiling and testing do not need them.

**Never paste real secrets into the repo, an issue, a PR or a commit message.** Share them in a private message, and change them if they ever leak.

## 2. Install and run (each in its own terminal)

```bash
# Smart contracts (compile and test only, no wallet key needed)
npm install
npx hardhat test

# Backend server, http://localhost:5000
cd server
npm install
node server.js

# Credit-score API, http://localhost:5001
cd API
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend, http://localhost:3000
cd credchain-frontend
npm install
npm start
```

## 3. Deploying the contract (only the person who owns the deploy wallet)

1. Copy `.env.example` to `.env` and set `PRIVATE_KEY` to a testnet-only wallet with some Sepolia ETH.
2. Run `npx hardhat run scripts/deploy.js --network sepolia`.
3. Put the printed address in:
   - `credchain-frontend/src/components/ScoreDisplay.jsx`
   - your `.env`
   - `API/.env`
4. Commit only the `ScoreDisplay.jsx` change.

## Troubleshooting

- **`npm install` fails with ERESOLVE:** make sure you have the latest `.npmrc` from the repo (run `git pull`).
- **`Error HH8` from Hardhat:** you have an old `hardhat.config.js`; run `git pull`.
- **Server can't connect to the database:** MongoDB isn't running.
- **`ImportError: geth_poa_middleware`:** reinstall with `pip install -r requirements.txt`, which pins web3 below v7.
