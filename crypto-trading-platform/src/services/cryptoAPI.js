const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const cryptoAPI = {
    // Get list of available coins
    getCoins: async () => {
        try {
            const response = await fetch(
                `${COINGECKO_API_URL}/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching coins:', error);
            throw error;
        }
    },

    // Get historical data for a specific coin
    getHistoricalData: async (coinId, days = 1) => {
        try {
            const response = await fetch(
                `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=gbp&days=${days}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    },

    // Get current price data for a specific coin
    getCoinData: async (coinId) => {
        try {
            const response = await fetch(
                `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching coin data:', error);
            throw error;
        }
    },

    executeTrade: async (tradeData) => {
        try {
            const response = await axios.post('/api/trade/', tradeData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Include any authentication headers if needed
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 