const express = require("express");
const app = express();
const { getAllStocks, getStockByTicker, addTrade, validateTrade } = require("./controllers");

app.use(express.json());

// Endpoint to get all stocks
app.get("/stocks", async (req, res) => {
 try{ 
 const stocks = await getAllStocks();
 if(stocks.length === 0){
   res.status(404).json({ error: "No Stocks found." });
 }
 return res.status(200).json({ stocks });
 } catch(error){
   res.status(500).json({ error: "Internal Server Error." });
 }
});

// Endpoint to get stock by Ticker Symbol
app.get("/stocks/:ticker", async (req, res) => {
 try{
  const stock = await getStockByTicker(req.params.ticker);
  if(!stock){
    return res.status(404).json({ error: "No stock found with this ticker" });
  }
  return res.status(200).json({ stock });
 } catch(error){
   res.status(500).json({ error: "Internal Server Error." });
 }
});

// Endpoint to add a new Trade
app.post("/trades", async (req, res) => {
 let error = validateTrade(req.body);
 if(error) return res.status(400).send(error);

 let trade = {...req.body};
 let addedTrade = await addTrade(trade);
 res.status(201).json(addedTrade);
});

module.exports = { app };

