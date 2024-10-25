let stocks = [
  { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
  { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
  { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
];

let trades = [
  { tradeId: 1, stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' },
  { tradeId: 2, stockId: 2, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' },
  { tradeId: 3, stockId: 3, quantity: 7, tradeType: 'buy', tradeDate: '2024-08-05' },
];

// function to get all stocks
function getAllStocks(){
  return stocks;
}

// function to get stock by ticker symbol
function getStockByTicker(ticker){
  return stocks.find(stock => stock.ticker === ticker);
}

// function to add a new Trade
async function addTrade(trade){
  trade.tradeId += 1;
  trades.push(trade);
  return trade;
}

// function to validate new Trade
function validateTrade(trade){
if(!trade.tradeId || typeof trade.tradeId !== "number"){
   return "Trade Id is required and should be a number.";
}
if(!trade.stockId || typeof trade.stockId !== "number"){
  return "Stock Id is required and should be a number.";
}
return null;
}

module.exports = { getAllStocks, getStockByTicker, addTrade, validateTrade };
