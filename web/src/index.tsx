import { render } from "react-dom";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
	ApolloLink,
	from,
} from "@apollo/react-hooks";
import { getAccessToken, setAccessToken } from "./accessToken";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { App } from "./App";

const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	const token = getAccessToken();
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	}));

	return forward(operation);
});

const client = new ApolloClient({
	link: from([
		new TokenRefreshLink({
			accessTokenField: "accessToken",
			isTokenValidOrUndefined: () => {
				const token = getAccessToken();

				if (!token) {
					return true;
				}

				try {
					const { exp }: any = jwtDecode(token);

					if (Date.now() >= exp * 1000) {
						return false;
					} else {
						return true;
					}
				} catch (error) {
					return false;
				}
			},
			fetchAccessToken: () => {
				return fetch("http://localhost:4000/refresh_token", {
					method: "POST",
					credentials: "include",
				});
			},
			handleFetch: (accessToken) => {
				setAccessToken(accessToken);
			},
			handleError: (err) => {
				console.warn("Your refresh token is invalid. Try to relogin");
				console.error(err);
			},
		}),
		authMiddleware,
		httpLink,
	]),
	cache: new InMemoryCache(),
	credentials: "include",
});

render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
