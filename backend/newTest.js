import fetch from "node-fetch";
import * as fs from "fs/promises";

//const result = await yahooFinance.quote("BBDC4.SA");

const FILE_LOCATION = "./companyNamesStatusInvest.json";

const newTest = async () => {
  const json = await fs
    .readFile(FILE_LOCATION)
    .then((file) => JSON.parse(file));

  const jsonreturn = await Promise.all(
    json.map(async (company) => {
      if (company.type) return {};
      try {
        const [data] = await fetch(
          `https://statusinvest.com.br/home/mainsearchquery?q=${company.symbol}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              //authorization: "Bearer " + auth,
            },
          }
        ).then((res) => res.json());

        const type = formatType(data.type);
        console.log(type);
        return {
          ...company,
          type,
        };
      } catch (err) {
        console.log(err);
        return company;
      }
    })
  );

  await fs.writeFile("./test.json", JSON.stringify(jsonreturn));
};

newTest();

function stringToDate(dateString) {
  let dateArray = dateString.split("/");

  var formatedDate = `20${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  return new Date(formatedDate);
}

function formatType(i) {
  switch (i) {
    case 1:
      return "acao";
    case 2:
      return "fii";
    case 3:
      return "tesouro";
    case 4:
      return "bdr";
    case 6:
      return "etfs";
    case 12:
      return "aco";
    case 13:
      return "reits";
    case 15:
      return "fundos-de-investimento";
    case 901:
      return "etf/eua";
    default:
      return "outro";
  }
}
