import axios from "axios";
import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js";

const getGeocodes = async (city) => {
	const token = await getKeyValue(TOKEN_DICTIONARY.token);

	if (!token) {
		throw new Error("No valid API key, use -t [API_KEY]");
	}

	const { data } = await axios.get(
		"http://api.openweathermap.org/geo/1.0/direct",
		{
			params: {
				q: `${city}`,
				appid: token,
				limit: 1,
			},
		}
	);

	return data;
};

const getWeather = async (city) => {
	const token = await getKeyValue(TOKEN_DICTIONARY.token);
	const language = (await getKeyValue(TOKEN_DICTIONARY.language)) ?? "en";

	if (!token) {
		throw new Error("No valid API key, use -t [API_KEY]");
	}

	const { data } = await axios.get(
		"https://api.openweathermap.org/data/2.5/weather",
		{
			params: {
				lat: city.lat,
				lon: city.lon,
				appid: token,
				units: "metric",
				lang: language,
			},
		}
	);

	return data;
};

const getIcon = (icon) => {
	switch (icon.slice(0, -1)) {
		case "01":
			return "☀️";
		case "02":
			return "🌤️";
		case "03":
			return "☁️";
		case "04":
			return "☁️";
		case "09":
			return "🌧️";
		case "10":
			return "🌦️";
		case "11":
			return "🌩️";
		case "13":
			return "❄️";
		case "50":
			return "🌫️";
	}
};

export { getWeather, getGeocodes, getIcon };
