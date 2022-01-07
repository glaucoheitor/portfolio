export const getAllSymbols = async (authData) => {
  try {
    const { data, errors } = await fetch("http://localhost:3001/graphql", {
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
    if (errors) return { error: errors[0].type };
    return {
      symbols: data.symbols.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)),
    };
  } catch (e) {
    console.log(e);
    return;
  }
};
