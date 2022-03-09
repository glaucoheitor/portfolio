import yahooFinance from "yahoo-finance2";

const getCurrentPrices = async (req, res) => {
  const { symbols } = req.body;

  const query = symbols.map((s) => `${s.symbol}.SA`);

  try {
    const data = await yahooFinance.quote(query, {
      fields: [
        "regularMarketPrice",
        "regularMarketPreviousClose",
        "regularMarketChangePercent",
      ],
    });

    const result = data.map((result) => {
      const symbol = symbols.find((s) => `${s.symbol}.SA` === result.symbol);

      const {
        regularMarketPrice,
        regularMarketPreviousClose,
        regularMarketChangePercent,
      } = result;

      return {
        prices: {
          currentPrice: regularMarketPrice,
          previousPrice: regularMarketPreviousClose,
          priceChangePercent: regularMarketChangePercent,
        },
        ...symbol,
      };
    });

    res.send(JSON.stringify(result));
    return;
  } catch (e) {
    console.error(e.errors);
    res.send({
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
      errors: e.errors,
      result: e.result,
    });
    return;
  }
};

export default getCurrentPrices;
