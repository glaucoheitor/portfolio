import yahooFinance from "yahoo-finance2";

const getCurrentPrices = async (req, res) => {
  const { symbol } = req.body;

  const query = `${symbol}.SA`;

  try {
    const data = await yahooFinance.quoteCombine(query, {
      fields: [
        "regularMarketPrice",
        "regularMarketPreviousClose",
        "regularMarketChangePercent",
      ],
    });

    const {
      regularMarketPrice,
      regularMarketPreviousClose,
      regularMarketChangePercent,
    } = data;

    res.send(
      JSON.stringify({
        currentPrice: regularMarketPrice,
        previousPrice: regularMarketPreviousClose,
        priceChangePercent: regularMarketChangePercent,
      })
    );
    return;
  } catch (e) {
    console.error(e);
    res.send({
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
    });
    return;
  }
};

export default getCurrentPrices;
