const URL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_LOCAL_BACKEND
    : process.env.REACT_APP_BACKEND;

export const getAllSymbols = async (authData) => {
  try {
    const { data, errors } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
            getAllSymbols {
              _id
              symbol
              type
            }
          }`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (await authData?.user?.auth?.currentUser?.getIdToken()),
      },
    }).then((res) => res.json());

    if (errors) return { error: errors[0].type };

    //separate stocks from the rest so they appear first
    const acoes = data.getAllSymbols
      .filter((s) => s.type === "acao")
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

    const outros = data.getAllSymbols
      .filter((s) => s.type !== "acao")
      .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

    return {
      symbols: [...acoes, ...outros],
    };
  } catch (e) {
    return { error: e };
  }
};

export const getSymbolId = async (authData, symbol) => {
  try {
    const { data, errors } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
            getSymbolId(symbol: "${symbol}")
          }`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (await authData?.user?.auth?.currentUser?.getIdToken()),
      },
    }).then((res) => res.json());

    if (errors) return { error: errors[0].type };

    return data?.getSymbolId;
  } catch (e) {
    return null;
  }
};
