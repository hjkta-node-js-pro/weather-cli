import chalk from "chalk";
import dedent from "dedent-js";

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
		-h output help (this menu)
		`
	);
};

const printWeather = (res) => {
	const { weather, main, wind, name } = res;
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

	console.log(
		dedent`${chalk.bgBlueBright("WEATHER")} Weather forecast of ${name}:
		${emojiStatus}  ${weather[0].main}
		Temperature: ${main.temp} (feels like ${main.feels_like})
		Humidity: ${main.humidity}%
		Speed of wind: ${wind.speed}
		`
	);
};

export { printError, printSuccess, printHelp, printWeather, printWarning };
