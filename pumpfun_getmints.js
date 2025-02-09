require('dotenv').config(); 

const { Connection, PublicKey } = require('@solana/web3.js');
const sqlite3 = require('sqlite3').verbose();
const cron = require('node-cron');
const axios = require('axios');

const db = new sqlite3.Database('./database.sqlite');
const connection = new Connection(process.env.REACT_APP_PUMPFUN_CONNECTION, 'confirmed');

const PUMPFUN_ADDRESS = new PublicKey('39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg');

async function fetchMintAddresses() {
  try {
    const signatures = await connection.getSignaturesForAddress(PUMPFUN_ADDRESS, {limit: 5});
    for (const { signature } of signatures) {
      const transactionDetails = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });
      const logMessages = transactionDetails.meta.logMessages;
      for (const logMessage of logMessages) {
        if (logMessage.includes("initialize2")) {
          const postTokenBalances = transactionDetails.meta.postTokenBalances;
          for (const tokenBalance of postTokenBalances) {
            if (tokenBalance.mint.endsWith("pump")) {
              await insertMintInDb(tokenBalance.mint);
            }
          }
        }
      }

    }
  } catch (error) {
    console.error('Erreur getting mint address');
  }
}

const checkIfMintExists = async (mint) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 1 FROM pumpfuntoken WHERE address = ? LIMIT 1`;
    db.get(query, [mint], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row !== undefined);
    });
  });
};

const insertMintInDb = async (mint) => {
  try {
    const exists = await checkIfMintExists(mint);
    if (exists) {
      return;
    }
    const symbol = await getTokenSymbol(mint);
    if(symbol != null){
      const query = `INSERT INTO pumpfuntoken (address, symbol) VALUES (?, ?)`;
      db.run(query, [mint, symbol], (err) => {
        if (err) {
          console.error('Error inserting mint into database:', err);
        } else {
          console.log(`Mint added in DB: ${mint}`);
        }
      });
    }
  } catch (error) {
    console.error('Error inserting mint into database:', error.message);
  }
};

async function getTokenSymbol(address) {
  try {
    const url = `https://tokens.jup.ag/token/${address}`;
    const response = await axios.get(url);
    const data = response.data;
    return data.symbol;
  } catch (error) {
    return null;
  }
}

cron.schedule('*/30 * * * * *', () => {
  fetchMintAddresses();
});