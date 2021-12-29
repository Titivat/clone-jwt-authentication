import { render } from "react-dom";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	ApolloLink,
	createHttpLink,
} from "@apollo/react-hooks";
import RoutesComponent from "./Routes";
import { getAccessToken } from "./accessToken";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_: any, { headers }: any): any => {
	const token = getAccessToken();
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	credentials: "include",
});

render(
	<ApolloProvider client={client}>
		<RoutesComponent />
	</ApolloProvider>,
	document.getElementById("root")
);
