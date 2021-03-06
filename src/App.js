import React, { useEffect } from "react";
import { useStateValue } from "./context/stateProvider";
import Player from "./Components/Player";
import { getTokenFromUrl } from "./spotify";
import "./App.css";
import Login from "./Components/Login";
//Allows React to work with Spotify API
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

function App() {
	const [{ token }, dispatch] = useStateValue();

	useEffect(() => {
		// Set token
		const hash = getTokenFromUrl();
		window.location.hash = "";
		const _token = hash.access_token;

		if (_token) {
			spotify.setAccessToken(_token);

			dispatch({
				type: "SET_TOKEN",
				token: _token,
			});

			spotify.getPlaylist("37i9dQZEVXcH9e7onmechP").then((response) => {
				dispatch({
					type: "SET_DISCOVER_WEEKLY",
					discover_weekly: response,
				});

				spotify.getMyTopArtists().then((response) =>
					dispatch({
						type: "SET_TOP_ARTISTS",
						top_artists: response,
					})
				);

				dispatch({
					type: "SET_SPOTIFY",
					spotify,
				});

				spotify.getMe().then((user) => {
					dispatch({
						type: "SET_USER",
						user,
					});
				});

				spotify.getUserPlaylists().then((playlists) => {
					dispatch({
						type: "SET_PLAYLISTS",
						playlists,
					});
				});
			});
		}
	}, [token, dispatch]);

	return (
		<div className='app'>
			{!token && <Login />}
			{token && <Player spotify={spotify} />}
		</div>
	);
}

export default App;
