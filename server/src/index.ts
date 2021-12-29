import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import cors from "cors";

async function listen(port: number) {
	const app = express();
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		})
	);
	app.use(cookieParser());

	app.get("/", (_req, res) => res.send("hello"));

	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}

		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRETE!);
		} catch (error) {
			console.log(error);
			return res.send({ ok: false, accessToken: "" });
		}

		// token is valid -> send back access token
		const user = await User.findOne({ id: payload.userId });

		if (!user) {
			return res.send({ ok: false, accessToken: "" });
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: "" });
		}

		sendRefreshToken(res, createRefreshToken(user));

		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

	await createConnection();

	const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
		resolvers: [UserResolver],
	});

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => ({ req, res }),
	});

	await server.start();

	server.applyMiddleware({ app, cors: false });

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
