import React from "react";
import { useLoginMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";
import {setAccessToken } from "../accessToken"

export const Login: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [login] = useLoginMutation();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				console.log("Form submit");
				const response = await login({
					variables: {
						email,
						password,
					},
				});
				console.log(response);
				if (response && response.data) {
					setAccessToken(response.data.login.accessToken);
				}

				navigate("/");
			}}
		>
			<div>
				<div>
					<input
						value={email}
						placeholder="email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<input
						type={"password"}
						value={password}
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>
			<button type="submit">Login</button>
		</form>
	);
};
