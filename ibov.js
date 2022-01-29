import yahooFinance from "yahoo-finance2";

export default async (req, res) => {
  const query = `^BVSP`;

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
    console.log(e.result.indicators.quote);
    res.send({
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
    });
    return;
  }
};
