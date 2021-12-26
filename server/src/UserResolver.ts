import {
	Query,
	Mutation,
	Resolver,
	Arg,
	ObjectType,
	Field,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return "hi!";
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("email", () => String) email: string,
		@Arg("password", () => String) password: string
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			throw new Error("could not find user");
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error("bad password");
		}

		//Login successful
		return {
			accessToken: sign({ userId: user.id }, "qwerqsdca", { expiresIn: "15m" }),
		};
	}

	@Mutation(() => Boolean)
	async register(
		@Arg("email", () => String) email: string,
		@Arg("password", () => String) password: string
	) {
		const hashedPassword = await hash(password, 12);

		try {
			await User.insert({
				email,
				password: hashedPassword,
			});
		} catch (error) {
			console.log(error);
			return false;
		}

		return true;
	}
}
