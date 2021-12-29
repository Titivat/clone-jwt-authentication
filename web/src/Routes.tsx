import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Bye } from "./pages/Bye";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const RoutesComponent: React.FC = () => {
	return (
		<BrowserRouter>
			<div>
				<header>
					<div>
						<Link to="/">Home</Link>
					</div>
					<div>
						<Link to="/register">Register</Link>
					</div>
					<div>
						<Link to="/login">Login</Link>
					</div>
					<div>
						<Link to="/bye">Bye</Link>
					</div>
				</header>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/bye" element={<Bye />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default RoutesComponent;
