import { buildSchema } from "graphql";
export default buildSchema(`
        type Trade {
            _id: ID!
            type: String!
            qty: Int!
            price: Float!
            total: Float!
            user: User
            symbol: Symbol!
            symbolName: String
            date: Float!
            createdAt: String
            updatedAt: String
        }

        type User {
            _id: ID!
            name: String!
            email: String!
            password: String
            role: String
            trades: [Trade!]
        }

        type Symbol {
            _id: ID!
            symbol: String
            lastRefreshed: Float
            companyName: CompanyName
        }

        type CompanyName {
            longName: String
            shortName: String
        }

        type StockData {
            _id: ID!
            date: Float!
            open: Float
            high: Float
            low: Float
            close: Float!
            adjClose: Float
            volume: Float
            symbol: Symbol!
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Float!
        }

        input TradeInput {
            type: String!
            symbolId: ID!
            qty: Int!
            price: Float!
            total: Float!
            date: Float!
        }

        input StockDataInput {
            date: Float!
            open: Float
            high: Float
            low: Float
            close: Float!
            adjClose: Float
            volume: Float
            symbolId: ID!
        }

        input UserInput {
            name: String!
            email: String!
            password: String!
            role: String
        }

        input LoginInput {
            email: String!
            password: String!
        }

        type RootQuery {
            trades: [Trade!]!
            tradesByUserId(userId: ID!): [Trade!]!
            users: [User!]!
            symbols: [Symbol!]!
            stockData(symbolId: ID!,startDate: String, endDate: String): [StockData!]!
            login(email:String!,password: String!): AuthData!
            verifyUser: Boolean!
        }

        type RootMutation {
            addTrade(tradeInput: TradeInput): Trade
            deleteTrade(tradeId: ID!): ID
            addStockData(stockDataInput: StockDataInput): StockData
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
