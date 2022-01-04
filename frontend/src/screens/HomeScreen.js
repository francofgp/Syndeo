import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Hero from "../components/Home/Hero";
import Feature from "../components/Home/Feature";
import AboutSyndeo from "../components/Home/AboutSyndeo";
import Service from "../components/Home/Service";
import About from "../components/Home/About";

function HomeScreen({ history }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo) {
			console.log(userInfo);
			history.push("/progreso");
		}
	}, [userInfo, history]);

	return (
		<div>
			{!userInfo ? (
				<div>
					<Hero />
					<AboutSyndeo />
					<Feature />
					{/* <Service /> */}
					<About />
				</div>
			) : null}
		</div>
	);
}

export default HomeScreen;
