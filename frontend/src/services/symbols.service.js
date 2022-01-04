export const getAllSymbols = async (authData) => {
  const { data } = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: `query {
            symbols {
              _id
              symbol
            }
          }`,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authData.token,
    },
  }).then((res) => res.json());
  return data.symbols.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
};
