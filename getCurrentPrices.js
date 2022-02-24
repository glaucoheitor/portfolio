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
    const date = new Date("2020-12-01");
    //const result = await yahooFinance._chart(query, { period1: date });

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
        //historical: result,
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

export default getCurrentPrices;
