import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";

const typeDefs = gql`
	type Query {
		hello: String!
	}
`;

const resolvers = {
	Query: {
		hello() {
			return "world";
		},
	},
};

async function listen(port: number) {
	const app = express();

	app.get("/", (_req, res) => res.send("hello"));

	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});
	await server.start();

	server.applyMiddleware({ app });

	return new Promise((resolve, reject) => {
		app.listen(port).once("listening", resolve).once("error", reject);
	});
}

async function main() {
	try {
		const PORT = 4000;
		await listen(PORT);
		console.log(`🚀 Server is ready at http://localhost:${PORT}/graphql`);
	} catch (err) {
		console.error("💀 Error starting the node server", err);
	}
}

void main();
