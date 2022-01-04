import fetch from "node-fetch";
import * as fs from "fs/promises";

//const result = await yahooFinance.quote("BBDC4.SA");

const FILE_LOCATION = "C:/projects/test.json";

const newTest = async () => {
  try {
    const [data] = await fetch(
      `https://statusinvest.com.br/home/mainsearchquery?q=XP`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //authorization: "Bearer " + auth,
        },
      }
    ).then((res) => res.json());
    console.log(data.type);
    return;
    const dataReturn = {
      symbol: "CASH3",
      prices: data[0].prices.map((p) => ({
        date: stringToDate(p.date.substring(0, 8)),
        price: p.price,
      })),
    };
    const json = await fs
      .readFile(FILE_LOCATION)
      .then((file) => JSON.parse(file));
    json.push(dataReturn);
    await fs.writeFile(FILE_LOCATION, JSON.stringify(json));
    console.log(dataReturn);
    return dataReturn;
  } catch (err) {
    console.log(err);
  }
};

newTest();

function stringToDate(dateString) {
  let dateArray = dateString.split("/");

  var formatedDate = `20${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  return new Date(formatedDate);
}
