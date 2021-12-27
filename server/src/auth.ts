import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

export const createAccessToken = (user: User) => {
	return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRETE!, {
		expiresIn: "7d",
	});
};

export const createRefreshToken = (user: User) => {
	return sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRETE!,
		{
			expiresIn: "15m",
		}
	);
};
