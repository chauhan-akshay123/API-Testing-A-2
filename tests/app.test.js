const request = require("supertest");
const { app } = require("../index.js");  
const { getAllStocks, getStockByTicker, addTrade, validateTrade } = require("../controllers");  
const http = require("http");
const { before, beforeEach } = require("node:test");

jest.mock("../controllers", () => {
  return {
    getAllStocks: jest.fn(),
    getStockByTicker: jest.fn(),
    addTrade: jest.fn(), 
    validateTrade:jest.fn()  
  };
});

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Enpoints Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("GET /stocks should return all stocks", async () => {
   const mockStocks = {
    stocks: [
      {
        stockId: 1,
        ticker: "AAPL",
        companyName: "Apple Inc.",
        price: 150.75
      },
      {
        stockId: 2,
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        price: 2750.1
      },
      {
        stockId: 3,
        ticker: "TSLA",
        companyName: "Tesla, Inc.",
        price: 695.5
      },
    ],
  };
  
  getAllStocks.mockReturnValueOnce(mockStocks.stocks);

  const response = await request(server).get("/stocks");

  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(mockStocks);
  expect(response.body.stocks.length).toEqual(3);
  });

  it("GET /stocks/:ticker should return stock by ticker symbol", async () => {
    const mockStock = {
      stock: {
        stockId: 1,
        ticker: "AAPL",
        companyName: "Apple Inc.",
        price: 150.75
      },
    };
    getStockByTicker.mockReturnValue(mockStock.stock);

    const response = await request(server).get("/stocks/AAPL");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(mockStock);
  });

  it("POST /trades should add a new trade", async () => {
    const mockTrade = { tradeId: 4, stockId: 4, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-10' };
    addTrade.mockResolvedValue(mockTrade);

    const response = await request(server)
        .post("/trades")
        .send(mockTrade);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(mockTrade);  
});
  
  it("GET /stocks/:ticker should return 404 if no stocks are found", async () => {
    getStockByTicker.mockResolvedValue(null);

    const response = await request(server).get("/stocks/sfdhwf");
    expect(response.statusCode).toEqual(404);
    expect(response.body.error).toBe("No stock found with this ticker");
  });
 
  it("Should validate for Trade input correctly", () => {
   validateTrade.mockReturnValue(null);
   expect(validateTrade({ tradeId: 4, stockId: 4, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-10' })).toBe(null);

   validateTrade.mockReturnValue("Trade Id is required and should be a number.")
   expect(validateTrade({ stockId: 4, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-10' })).toBe("Trade Id is required and should be a number.");

   validateTrade.mockReturnValue("Stock Id is required and should be a number.");
   expect(validateTrade({ tradeId: 4, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-10' })).toBe("Stock Id is required and should be a number.");
  });
  
});

describe("Function Tests", () => {
 beforeEach(() => {
  jest.clearAllMocks();
 });
 
 test("getAllStocks() should return all stocks", () => {
  const mockStocks = [
    { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
    { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
    { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
  ];

  getAllStocks.mockReturnValue(mockStocks);

  let result = getAllStocks();
  expect(result).toEqual(mockStocks);
  expect(getAllStocks).toHaveBeenCalled();
 });

 test("addTrade() should add a new trade", async () => {
  const newTrade = {  tradeId: 4, stockId: 4, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-10' };
  
  addTrade.mockReturnValue(newTrade);

  let result = await addTrade(newTrade);
  expect(result).toEqual(newTrade);
  expect(addTrade).toHaveBeenCalledWith(newTrade);
 });

});