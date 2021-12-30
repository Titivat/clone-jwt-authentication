import React from "react";
import RoutesComponent from "./Routes";

export const App: React.FC = () => {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		fetch("http://localhost:4000/refresh_token", {
			method: "POST",
			credentials: "include",
		}).then(async (res) => {
			const data = await res.json();
			console.log(data);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return <div>loading...</div>;
	}

	return <RoutesComponent />;
};
