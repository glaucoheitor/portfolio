export const getAllSymbols = async (authData) => {
  try {
    const { data, errors } = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
            symbols {
              _id
              symbol
              type
            }
          }`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authData.token,
      },
    }).then((res) => res.json());

    if (errors) return { error: errors[0].type };
    console.log(data.symbols);
    //separate stocks from the rest so they appear first
    const acoes = data.symbols
      .filter((s) => s.type === "acao")
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

    const outros = data.symbols
      .filter((s) => s.type !== "acao")
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

    return {
      symbols: [...acoes, ...outros],
    };
  } catch (e) {
    console.log(e);
    return;
  }
};
