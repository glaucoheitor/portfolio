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

let cookies = res.headers.raw()["set-cookie"];
let cookie = cookies.map((cookie) => cookie.split(";")[0]).join("; ");

const { data } = await res.json();

const airportCodes = data.places.map((place) => place.iataCode);

//console.log(airportCodes);
let flights = [];
cookie = "";
for (const airportCode of airportCodes) {
  const controller = new AbortController();
  console.log(airportCode);
  console.log(cookie);
  const flightsDataRes = await fetch(
    `https://www.latamairlines.com/bff/air-offers/offers/search?sort=RECOMMENDED&cabinType=Economy&origin=PAR&destination=${airportCode}&inFlightDate=null&inFrom=null&inOfferId=null&outFlightDate=null&outFrom=2022-02-23&outOfferId=null&adult=1&child=0&infant=0&redemption=false`,
    //4000,
    {
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,es;q=0.6",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "x-latam-app-session-id": "4ef34bea-e030-47be-949c-f127ec3890d1",
        "x-latam-application-country": "BR",
        "x-latam-application-lang": "pt",
        "x-latam-application-name": "web-air-offers",
        "x-latam-application-oc": "br",
        "x-latam-client-name": "web-air-offers",
        "x-latam-request-id": "23ef105a-eb98-4428-8f61-c150634b9961",
        "x-latam-track-id": "ca272c98-7763-4404-a550-5bf9dabcd8ad",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        Cookie: cookie,
      },
    }
  ).catch((error) => {
    console.log(error);
    return null;
  });

  cookies = flightsDataRes.headers.raw()["set-cookie"];
  cookie = cookies.map((cookie) => cookie.split(";")[0]).join("; ");

  const flightsData = await flightsDataRes.json();

  if (!flightsData) continue;

  console.log(flightsData);

  const flight = flightsData.content.filter((flight) =>
    flight.summary.tags.includes("RECOMMENDED")
  );

  flights.push(flight);
  await fs.writeFile(`json/${airportCode}.json`, JSON.stringify(flights));
}

await fs.writeFile("flights.json", JSON.stringify(flights));
