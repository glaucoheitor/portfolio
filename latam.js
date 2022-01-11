import fetch from "node-fetch";
import * as fs from "fs/promises";

const fetchTimeout = (url, ms, { signal, ...options } = {}) => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal, ...options });
  if (signal) signal.addEventListener("abort", () => controller.abort());
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};

const res = await fetch(
  "https://bff.latam.com/ws/api/bookingbox-services/v1/destinations?airline=tam&portal=pessoas&application=fidelidade&applicationName=shopping&country=BR&language=pt&step=2&origin=city::PAR"
);

let cookie = res.headers.get("set-cookie");

const { data } = await res.json();

const airportCodes = data.places.map((place) => place.iataCode);

//console.log(airportCodes);
let flights = [];

for (const airportCode of airportCodes) {
  const controller = new AbortController();
  console.log(airportCode);
  console.log(cookie);
  const flightsDataRes = await fetchTimeout(
    `https://bff.latam.com/ws/proxy/booking-webapp-bff/v1/public/redemption/recommendations/oneway?departure=2022-02-03&origin=PAR&destination=${airportCode}&cabin=Y&country=BR&language=PT&home=pt_br&adult=1&tierCode=LTAM&tierType=low`,
    4000,
    {
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es;q=0.6",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        //"x-flow-id": "95d90fee-5dcb-4d0f-b1a2-973daac6d5d9",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        cookie: cookie,
      },
    }
  ).catch((error) => {
    console.log(error);
    return null;
  });

  cookie = flightsDataRes.headers.get("set-cookie");

  const flightsData = await flightsDataRes.json();

  if (!flightsData) continue;
  const flight = flightsData.data[0].flights.filter(
    (flight) => flight.flightCode === flightsData.data[0].recommendedFlightCode
  );

  flights.push(flight);
  await fs.writeFile(`json/${airportCode}.json`, JSON.stringify(flights));
}

await fs.writeFile("flights.json", JSON.stringify(flights));
