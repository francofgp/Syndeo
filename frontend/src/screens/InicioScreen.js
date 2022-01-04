import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function InicioScreen({ history }) {

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (!userInfo) {
			history.push("/login?redirect=inicio");
		}
	}, [userInfo, history]);

	return (
		<div>
			<br/>
			{userInfo ? (<div>
				Pagina logeado
			</div>) : null}
		</div>
	)
}

export default InicioScreen;
