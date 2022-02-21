import yahooFinance from "yahoo-finance2";
import { isValid, parse, subDays, formatISO } from "date-fns";

export const ibov = async (req, res) => {
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
    console.log(e.result?.indicators?.quote);
    res.send({
      currentPrice: null,
      historical: {},
      previousPrice: null,
      priceChangePercent: null,
    });
    return;
  }
};

export const historical = async (req, res) => {
  const symbol = req.query?.symbol;
  if (!symbol) return res.status(400).send("No symbol was supplied.");
  if (!/^[a-z0-9]+$/i.test(symbol))
    return res.status(400).send("Invalid symbol.");

  //get startDate from query and try to parse it, if it's undefined set to 10 days ago.
  const startDateQuery = req.query?.startDate;
  const startDate = startDateQuery
    ? parse(startDateQuery, "yyyy-MM-dd", new Date())
    : subDays(new Date(), 10);

  if (!isValid(startDate)) return res.status(400).send("Invalid Date.");

  const formatOptions = { representation: "date" };
  const formatedDate = formatISO(startDate, formatOptions);

  try {
    const query = `${symbol.toUpperCase()}.SA`;
    const queryOptions = { period1: formatedDate /* ... */ };
    const data = await yahooFinance.historical(query, queryOptions);
    return res.send({ data });
  } catch (e) {
    return res.send({ error: e });
  }
};
