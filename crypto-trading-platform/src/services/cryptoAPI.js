const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Add delay helper function to manage rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback mock data in case the API fails
const MOCK_CRYPTOCURRENCIES = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 50000, price_change_percentage_24h: 0.5 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3000, price_change_percentage_24h: 0.3 },
    { id: 'ripple', symbol: 'XRP', name: 'Ripple', current_price: 0.5, price_change_percentage_24h: 0.2 },
    { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', current_price: 1000, price_change_percentage_24h: 0.4 },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', current_price: 150, price_change_percentage_24h: 0.3 },
    { id: 'eos', symbol: 'EOS', name: 'EOS', current_price: 5, price_change_percentage_24h: 0.2 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar', current_price: 0.2, price_change_percentage_24h: 0.05 },
    { id: 'monero', symbol: 'XMR', name: 'Monero', current_price: 100, price_change_percentage_24h: 0.3 },
    { id: 'iota', symbol: 'MIOTA', name: 'IOTA', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'neo', symbol: 'NEO', name: 'NEO', current_price: 10, price_change_percentage_24h: 0.2 },
    { id: 'dash', symbol: 'DASH', name: 'Dash', current_price: 200, price_change_percentage_24h: 0.3 },
    { id: 'zcash', symbol: 'ZEC', name: 'Zcash', current_price: 100, price_change_percentage_24h: 0.4 },
    { id: 'binance-coin', symbol: 'BNB', name: 'Binance Coin', current_price: 300, price_change_percentage_24h: 0.5 },
    { id: 'tezos', symbol: 'XTZ', name: 'Tezos', current_price: 5, price_change_percentage_24h: 0.2 },
    { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', current_price: 50, price_change_percentage_24h: 0.3 },
    { id: 'algorand', symbol: 'ALGO', name: 'Algorand', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', current_price: 10, price_change_percentage_24h: 0.2 },
    { id: 'terra', symbol: 'LUNA', name: 'Terra', current_price: 50, price_change_percentage_24h: 0.3 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', current_price: 0.002, price_change_percentage_24h: 0.05 },
    { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', current_price: 0.000002, price_change_percentage_24h: 0.05 },
    { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', current_price: 10, price_change_percentage_24h: 0.2 },
    { id: 'holo', symbol: 'HOT', name: 'Holo', current_price: 0.001, price_change_percentage_24h: 0.05 },
    { id: 'klay-token', symbol: 'KLAY', name: 'Klaytn', current_price: 0.001, price_change_percentage_24h: 0.05 },
    { id: 'theta-token', symbol: 'THETA', name: 'Theta', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'enjin-coin', symbol: 'ENJ', name: 'Enjin Coin', current_price: 0.001, price_change_percentage_24h: 0.05 },
    { id: 'kusama', symbol: 'KSM', name: 'Kusama', current_price: 100, price_change_percentage_24h: 0.2 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', current_price: 10, price_change_percentage_24h: 0.1 },
    { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', current_price: 50, price_change_percentage_24h: 0.3 },
    { id: 'fantom', symbol: 'FTM', name: 'Fantom', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'moonbeam', symbol: 'GLMR', name: 'Moonbeam', current_price: 10, price_change_percentage_24h: 0.2 },
    { id: 'moonriver', symbol: 'MOVR', name: 'Moonriver', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'celo', symbol: 'CELO', name: 'Celo', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera Hashgraph', current_price: 0.1, price_change_percentage_24h: 0.05 },
    { id: 'near', symbol: 'NEAR', name: 'Near', current_price: 10, price_change_percentage_24h: 0.2 },
    { id: 'terra-luna-2', symbol: 'LUNA2', name: 'Terra Luna 2', current_price: 50, price_change_percentage_24h: 0.3 },
    { id: 'kava', symbol: 'KAVA', name: 'Kava', current_price: 1, price_change_percentage_24h: 0.1 },
    { id: 'terra-usd', symbol: 'UST', name: 'Terra USD', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-usdt', symbol: 'UST', name: 'Terra USDT', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-usdc', symbol: 'UST', name: 'Terra USDC', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust', symbol: 'UST', name: 'Terra UST', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-native', symbol: 'UST', name: 'Terra UST Native', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c', symbol: 'UST', name: 'Terra UST C', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native', symbol: 'UST', name: 'Terra UST C Native', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v1', symbol: 'UST', name: 'Terra UST C Native V1', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v2', symbol: 'UST', name: 'Terra UST C Native V2', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v3', symbol: 'UST', name: 'Terra UST C Native V3', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v4', symbol: 'UST', name: 'Terra UST C Native V4', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v5', symbol: 'UST', name: 'Terra UST C Native V5', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v6', symbol: 'UST', name: 'Terra UST C Native V6', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v7', symbol: 'UST', name: 'Terra UST C Native V7', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v8', symbol: 'UST', name: 'Terra UST C Native V8', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v9', symbol: 'UST', name: 'Terra UST C Native V9', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v10', symbol: 'UST', name: 'Terra UST C Native V10', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v11', symbol: 'UST', name: 'Terra UST C Native V11', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v12', symbol: 'UST', name: 'Terra UST C Native V12', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v13', symbol: 'UST', name: 'Terra UST C Native V13', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v14', symbol: 'UST', name: 'Terra UST C Native V14', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v15', symbol: 'UST', name: 'Terra UST C Native V15', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v16', symbol: 'UST', name: 'Terra UST C Native V16', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v17', symbol: 'UST', name: 'Terra UST C Native V17', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v18', symbol: 'UST', name: 'Terra UST C Native V18', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v19', symbol: 'UST', name: 'Terra UST C Native V19', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v20', symbol: 'UST', name: 'Terra UST C Native V20', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v21', symbol: 'UST', name: 'Terra UST C Native V21', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v22', symbol: 'UST', name: 'Terra UST C Native V22', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v23', symbol: 'UST', name: 'Terra UST C Native V23', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v24', symbol: 'UST', name: 'Terra UST C Native V24', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v25', symbol: 'UST', name: 'Terra UST C Native V25', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v26', symbol: 'UST', name: 'Terra UST C Native V26', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v27', symbol: 'UST', name: 'Terra UST C Native V27', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v28', symbol: 'UST', name: 'Terra UST C Native V28', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v29', symbol: 'UST', name: 'Terra UST C Native V29', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v30', symbol: 'UST', name: 'Terra UST C Native V30', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v31', symbol: 'UST', name: 'Terra UST C Native V31', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v32', symbol: 'UST', name: 'Terra UST C Native V32', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v33', symbol: 'UST', name: 'Terra UST C Native V33', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v34', symbol: 'UST', name: 'Terra UST C Native V34', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v35', symbol: 'UST', name: 'Terra UST C Native V35', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v36', symbol: 'UST', name: 'Terra UST C Native V36', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v37', symbol: 'UST', name: 'Terra UST C Native V37', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v38', symbol: 'UST', name: 'Terra UST C Native V38', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v39', symbol: 'UST', name: 'Terra UST C Native V39', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v40', symbol: 'UST', name: 'Terra UST C Native V40', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v41', symbol: 'UST', name: 'Terra UST C Native V41', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v42', symbol: 'UST', name: 'Terra UST C Native V42', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v43', symbol: 'UST', name: 'Terra UST C Native V43', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v44', symbol: 'UST', name: 'Terra UST C Native V44', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v45', symbol: 'UST', name: 'Terra UST C Native V45', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v46', symbol: 'UST', name: 'Terra UST C Native V46', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v47', symbol: 'UST', name: 'Terra UST C Native V47', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v48', symbol: 'UST', name: 'Terra UST C Native V48', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v49', symbol: 'UST', name: 'Terra UST C Native V49', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v50', symbol: 'UST', name: 'Terra UST C Native V50', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v51', symbol: 'UST', name: 'Terra UST C Native V51', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v52', symbol: 'UST', name: 'Terra UST C Native V52', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v53', symbol: 'UST', name: 'Terra UST C Native V53', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v54', symbol: 'UST', name: 'Terra UST C Native V54', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v55', symbol: 'UST', name: 'Terra UST C Native V55', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v56', symbol: 'UST', name: 'Terra UST C Native V56', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v57', symbol: 'UST', name: 'Terra UST C Native V57', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v58', symbol: 'UST', name: 'Terra UST C Native V58', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v59', symbol: 'UST', name: 'Terra UST C Native V59', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v60', symbol: 'UST', name: 'Terra UST C Native V60', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v61', symbol: 'UST', name: 'Terra UST C Native V61', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v62', symbol: 'UST', name: 'Terra UST C Native V62', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v63', symbol: 'UST', name: 'Terra UST C Native V63', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v64', symbol: 'UST', name: 'Terra UST C Native V64', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v65', symbol: 'UST', name: 'Terra UST C Native V65', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v66', symbol: 'UST', name: 'Terra UST C Native V66', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v67', symbol: 'UST', name: 'Terra UST C Native V67', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v68', symbol: 'UST', name: 'Terra UST C Native V68', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v69', symbol: 'UST', name: 'Terra UST C Native V69', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v70', symbol: 'UST', name: 'Terra UST C Native V70', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v71', symbol: 'UST', name: 'Terra UST C Native V71', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v72', symbol: 'UST', name: 'Terra UST C Native V72', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v73', symbol: 'UST', name: 'Terra UST C Native V73', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v74', symbol: 'UST', name: 'Terra UST C Native V74', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v75', symbol: 'UST', name: 'Terra UST C Native V75', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v76', symbol: 'UST', name: 'Terra UST C Native V76', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v77', symbol: 'UST', name: 'Terra UST C Native V77', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v78', symbol: 'UST', name: 'Terra UST C Native V78', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v79', symbol: 'UST', name: 'Terra UST C Native V79', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v80', symbol: 'UST', name: 'Terra UST C Native V80', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v81', symbol: 'UST', name: 'Terra UST C Native V81', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v82', symbol: 'UST', name: 'Terra UST C Native V82', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v83', symbol: 'UST', name: 'Terra UST C Native V83', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v84', symbol: 'UST', name: 'Terra UST C Native V84', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v85', symbol: 'UST', name: 'Terra UST C Native V85', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v86', symbol: 'UST', name: 'Terra UST C Native V86', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v87', symbol: 'UST', name: 'Terra UST C Native V87', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v88', symbol: 'UST', name: 'Terra UST C Native V88', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v89', symbol: 'UST', name: 'Terra UST C Native V89', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v90', symbol: 'UST', name: 'Terra UST C Native V90', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v91', symbol: 'UST', name: 'Terra UST C Native V91', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v92', symbol: 'UST', name: 'Terra UST C Native V92', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v93', symbol: 'UST', name: 'Terra UST C Native V93', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v94', symbol: 'UST', name: 'Terra UST C Native V94', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v95', symbol: 'UST', name: 'Terra UST C Native V95', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v96', symbol: 'UST', name: 'Terra UST C Native V96', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v97', symbol: 'UST', name: 'Terra UST C Native V97', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v98', symbol: 'UST', name: 'Terra UST C Native V98', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v99', symbol: 'UST', name: 'Terra UST C Native V99', current_price: 1, price_change_percentage_24h: 0.05 },
    { id: 'terra-ust-c-native-v100', symbol: 'UST', name: 'Terra UST C Native V100', current_price: 1, price_change_percentage_24h: 0.05 },
];

export const cryptoAPI = {
    // Get list of available coins
    getCoins: async () => {
        try {
            try {
                // Add delay to avoid rate limiting
                const response = await fetch(
                    `${COINGECKO_API_URL}/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    }
                );
                
                if (response.status === 429) {
                    console.warn('CoinGecko rate limit reached, using mock data');
                    return MOCK_CRYPTOCURRENCIES;
                }
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch coins: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('CoinGecko API error, using mock data:', error);
                return MOCK_CRYPTOCURRENCIES;
            }
        } catch (error) {
            console.error('Error fetching coins:', error);
            return MOCK_CRYPTOCURRENCIES; // Always return mock data as fallback
        }
    },

    // Get historical data for a specific coin
    getHistoricalData: async (coinId, days = 1) => {
        try {
            try {
                // Add delay to avoid rate limiting
                await delay(300);
                
                const response = await fetch(
                    `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=gbp&days=${days}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    }
                );
                
                if (response.status === 429) {
                    console.warn('CoinGecko rate limit reached, using mock data');
                    // Generate mock historical data
                    const mockData = {
                        prices: Array.from({ length: 24 }, (_, i) => {
                            const timestamp = Date.now() - (23 - i) * 3600000;
                            const price = 50000 + (Math.random() - 0.5) * 10000;
                            return [timestamp, price];
                        })
                    };
                    return mockData;
                }
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch historical data: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('CoinGecko historical data API error, using mock data:', error);
                // Generate mock historical data
                const mockData = {
                    prices: Array.from({ length: 24 }, (_, i) => {
                        // Generate a timestamp for each hour in the past 24 hours
                        const timestamp = Date.now() - (23 - i) * 3600000;
                        // Generate a random price between 45000 and 55000
                        const price = 50000 + (Math.random() - 0.5) * 10000;
                        return [timestamp, price];
                    })
                };
                return mockData;
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
            // Return simple mock data as fallback
            const mockData = {
                prices: Array.from({ length: 24 }, (_, i) => {
                    const timestamp = Date.now() - (23 - i) * 3600000;
                    const price = 50000 + (Math.random() - 0.5) * 10000;
                    return [timestamp, price];
                })
            };
            return mockData;
        }
    },

    // Get current price data for a specific coin
    getCoinData: async (coinId) => {
        try {
            try {
                // Add delay to avoid rate limiting
                await delay(500);
                
                const response = await fetch(
                    `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    }
                );
                
                if (response.status === 429) {
                    console.warn('CoinGecko rate limit reached, using mock data for coin:', coinId);
                    const mockCoin = MOCK_CRYPTOCURRENCIES.find(c => c.id === coinId) || MOCK_CRYPTOCURRENCIES[0];
                    
                    return {
                        id: mockCoin.id,
                        symbol: mockCoin.symbol,
                        name: mockCoin.name,
                        market_data: {
                            current_price: {
                                gbp: mockCoin.current_price
                            },
                            price_change_percentage_24h: mockCoin.price_change_percentage_24h,
                            high_24h: {
                                gbp: mockCoin.current_price * 1.05
                            },
                            low_24h: {
                                gbp: mockCoin.current_price * 0.95
                            }
                        }
                    };
                }
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch coin data: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('CoinGecko coin data API error, using mock data:', error);
                // Find the coin in the mock data
                const mockCoin = MOCK_CRYPTOCURRENCIES.find(c => c.id === coinId) || MOCK_CRYPTOCURRENCIES[0];
                
                // Generate mock coin data structure
                return {
                    id: mockCoin.id,
                    symbol: mockCoin.symbol,
                    name: mockCoin.name,
                    market_data: {
                        current_price: {
                            gbp: mockCoin.current_price
                        },
                        price_change_percentage_24h: mockCoin.price_change_percentage_24h,
                        high_24h: {
                            gbp: mockCoin.current_price * 1.05
                        },
                        low_24h: {
                            gbp: mockCoin.current_price * 0.95
                        }
                    }
                };
            }
        } catch (error) {
            console.error('Error fetching coin data:', error);
            throw error;
        }
    },

    // Trade API calls
    executeTrade: async (tradeData, token) => {
        try {
            // Format the payload according to what the backend expects
            const payload = {
                cryptocurrency_id: tradeData.cryptocurrency_id,
                amount: parseFloat(tradeData.amount),
                trade_type: tradeData.trade_type,
                price: parseFloat(tradeData.price)
            };

            console.log('Executing trade with payload:', payload);

            // Try to call the backend API
            try {
                const response = await fetch('http://127.0.0.1:8000/api/trade/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token || localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Trade execution failed');
                }
                
                return await response.json();
            } catch (apiError) {
                console.error('Backend trade API error:', apiError);
                // If backend API fails, update local storage directly
                await cryptoAPI.updatePortfolioWithTrade(tradeData);
                await cryptoAPI.updateBalanceWithTrade(tradeData);
                
                return { message: 'Trade executed in local storage' };
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            throw error;
        }
    },

    // Get user portfolio
    getUserPortfolio: async (token) => {
        try {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/portfolio/', {
                    headers: {
                        'Authorization': `Token ${token || localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch portfolio from backend');
                }
                
                return await response.json();
            } catch (apiError) {
                console.error('Backend portfolio API error:', apiError);
                
                // If backend API fails, return mock portfolio data from localStorage
                const storedPortfolio = localStorage.getItem('userPortfolio');
                if (storedPortfolio) {
                    return JSON.parse(storedPortfolio);
                }
                
                // If no stored portfolio, return empty array
                return [];
            }
        } catch (error) {
            console.error('Portfolio fetch error:', error);
            return []; // Return empty array on failure
        }
    },

    // Update portfolio with a trade
    updatePortfolioWithTrade: async (tradeData) => {
        try {
            // Get current portfolio
            let portfolio = [];
            try {
                const storedPortfolio = localStorage.getItem('userPortfolio');
                if (storedPortfolio) {
                    portfolio = JSON.parse(storedPortfolio);
                }
            } catch (error) {
                console.error('Error parsing stored portfolio:', error);
                portfolio = [];
            }
            
            // Find if we already have this currency
            const existingCryptoIndex = portfolio.findIndex(
                item => item.cryptocurrency_symbol.toLowerCase() === tradeData.currency.toLowerCase()
            );
            
            const amount = parseFloat(tradeData.amount);
            
            if (existingCryptoIndex >= 0) {
                // Update existing holding
                if (tradeData.trade_type === 'BUY') {
                    portfolio[existingCryptoIndex].amount += amount;
                } else if (tradeData.trade_type === 'SELL') {
                    portfolio[existingCryptoIndex].amount -= amount;
                    // Remove if amount is zero or negative
                    if (portfolio[existingCryptoIndex].amount <= 0) {
                        portfolio.splice(existingCryptoIndex, 1);
                    }
                }
            } else if (tradeData.trade_type === 'BUY') {
                // Add new holding only for BUY (can't sell what you don't have)
                portfolio.push({
                    cryptocurrency_symbol: tradeData.currency.toLowerCase(),
                    amount: amount
                });
            }
            
            // Save updated portfolio
            localStorage.setItem('userPortfolio', JSON.stringify(portfolio));
            
            return portfolio;
        } catch (error) {
            console.error('Error updating portfolio:', error);
            throw error;
        }
    },
    
    // Get user balance
    getUserBalance: async (token) => {
        try {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/balance/', {
                    headers: {
                        'Authorization': `Token ${token || localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch balance from backend');
                }
                
                return await response.json();
            } catch (apiError) {
                console.error('Backend balance API error:', apiError);
                
                // If backend API fails, get balance from localStorage
                const storedBalance = localStorage.getItem('userBalance');
                if (storedBalance) {
                    return { balance: parseFloat(storedBalance) };
                }
                
                // If no stored balance, set default
                const defaultBalance = 10000;
                localStorage.setItem('userBalance', defaultBalance.toString());
                return { balance: defaultBalance };
            }
        } catch (error) {
            console.error('Balance fetch error:', error);
            // Default to 10000 if all else fails
            return { balance: 10000 };
        }
    },
    
    // Update balance with a trade
    updateBalanceWithTrade: async (tradeData) => {
        try {
            // Get current balance
            let balance = 10000; // Default starting balance
            try {
                const storedBalance = localStorage.getItem('userBalance');
                if (storedBalance) {
                    balance = parseFloat(storedBalance);
                }
            } catch (error) {
                console.error('Error parsing stored balance:', error);
            }
            
            const amount = parseFloat(tradeData.amount);
            const price = parseFloat(tradeData.price);
            const tradeCost = amount * price;
            
            // Update balance based on trade type
            if (tradeData.trade_type === 'BUY') {
                balance -= tradeCost;
            } else if (tradeData.trade_type === 'SELL') {
                balance += tradeCost;
            }
            
            // Save updated balance
            localStorage.setItem('userBalance', balance.toString());
            
            return { balance };
        } catch (error) {
            console.error('Error updating balance:', error);
            throw error;
        }
    }
}; 