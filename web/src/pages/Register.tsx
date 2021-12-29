import React from "react";
import { useRegisterMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [register] = useRegisterMutation();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				console.log("Form submit");
				const response = await register({
					variables: {
						email,
						password,
					},
				});
				console.log(response);
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
			<button type="submit">Register</button>
		</form>
	);
};
