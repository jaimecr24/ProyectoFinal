import React, { useContext } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Context } from "./store/appContext";
import { Navbar } from "./component/navbar";
//import { Footer } from "./component/footer";
import { FormSignUp } from "./component/formsignup";
import { FormLogin } from "./component/formlogin";

import { Places } from "./pages/places";
import { SinglePlace } from "./pages/singlePlace";

import { Films } from "./pages/films";
import { InfoFilms } from "./pages/infoFilms";
import { Countries } from "./pages/countries";
import { InfoCountries } from "./pages/infoCountries";

import { Profile } from "./pages/profile";

//create your first component
const Layout = () => {
	//the basename is used when your project is published in a subdirectory and not in the root of the domain
	// you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
	const basename = process.env.BASENAME || "";

	const { store } = useContext(Context);
	return (
		<div>
			<BrowserRouter basename={basename}>
				<ScrollToTop>
					<Navbar />
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>

						<Route exact path="/places">
							<Places />
						</Route>
						<Route exact path="/place/:theid">
							<SinglePlace />
						</Route>

						<Route exact path="/films">
							<Films />
						</Route>

						<Route exact path="/infofilms">
							<InfoFilms />
						</Route>
						<Route exact path="/countries">
							<Countries />
						</Route>

						<Route exact path="/infocountries">
							<InfoCountries />
						</Route>
						<Route exact path="/demo">
							<Demo />
						</Route>
						<Route exact path="/signup">
							<FormSignUp />
						</Route>
						<Route exact path="/login">
							{store.activeUserId ? <Redirect from="/login" to="/" /> : <FormLogin />}
						</Route>
						<Route exact path="/profile">
							{store.activeUserId ? <Profile /> : <Redirect from="/profile" to="/" />}
						</Route>
						<Route exact path="/single/:theid">
							<Single />
						</Route>
						<Route>
							<h1>Not found!</h1>
						</Route>
					</Switch>
					{/* <Footer /> */}
				</ScrollToTop>
			</BrowserRouter>
		</div>
	);
};

export default injectContext(Layout);
