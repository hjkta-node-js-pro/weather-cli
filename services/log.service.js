import chalk from "chalk";
import dedent from "dedent-js";

import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js";
import { getLangValue } from "./language.service.js";

const printError = (error) => {
	console.log(chalk.bgRed(`ERROR: ${error}`));
};

const printSuccess = (message) => {
	console.log(chalk.bgGreen(`SUCCESS: ${message}`));
};

const printWarning = (message) => {
	console.log(chalk.bgYellow(`WARNING: ${message}`));
};

const printHelp = () => {
	console.log(
		dedent`${chalk.bgCyan("HELP")}
		Without parameters forecast output
		-c [CITY] setup city
		-t [API_KEY] setup API key
		-l ["en", "ru"] setup language
		-h output help (this menu)
		`
	);
};

const printWeather = async (res) => {
	const { weather, main, wind, name } = res;
	const language = (await getKeyValue(TOKEN_DICTIONARY.language)) ?? "en";
	let emojiStatus;

	switch (weather[0].icon.slice(0, -1)) {
		case "01":
			emojiStatus = "☀️";
			break;
		case "02":
			emojiStatus = "🌤️";
			break;
		case "03":
			emojiStatus = "☁️";
			break;
		case "04":
			emojiStatus = "☁️";
			break;
		case "09":
			emojiStatus = "🌧️";
			break;
		case "10":
			emojiStatus = "🌦️";
			break;
		case "11":
			emojiStatus = "⛈️";
			break;
		case "13":
			emojiStatus = "❄️";
			break;
		case "50":
			emojiStatus = "🌫️";
			break;
		default:
			emojiStatus = "🌡️";
			break;
	}

	const resultsLocalized = await getLangValue("results", language);

	console.log(
		dedent`${chalk.bgBlueBright("WEATHER")} ${resultsLocalized.TITLE} ${name}:
		${emojiStatus}  ${weather[0].main}
		${resultsLocalized.TEMP}: ${main.temp} (${resultsLocalized.FEELS_LIKE} ${
			main.feels_like
		})
		${resultsLocalized.HUMIDITY}: ${main.humidity}%
		${resultsLocalized.SPEED}: ${wind.speed}
		`
	);
};

export { printError, printSuccess, printHelp, printWeather, printWarning };
