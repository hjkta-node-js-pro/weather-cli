#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getGeocodes, getWeather } from "./services/api.service.js";
import {
	printHelp,
	printSuccess,
	printError,
	printWarning,
	printWeather,
} from "./services/log.service.js";
import {
	getKeyValue,
	saveKeyValue,
	TOKEN_DICTIONARY,
} from "./services/storage.service.js";

const saveToken = async (token) => {
	if (!token.length) {
		printError("Token is missing");

		return;
	}

	try {
		await saveKeyValue(TOKEN_DICTIONARY.token, token);
		printSuccess("Token has been saved");
	} catch (e) {
		printError(e.message);
	}
};

const saveCity = async (city) => {
	if (!city.length) {
		printError("City is missing");

		return;
	}

	try {
		const geodata = await getGeocodes(city);
		await saveKeyValue(TOKEN_DICTIONARY.city, geodata[0]);
	} catch (e) {
		switch (e?.response?.status) {
			case 404:
				printError("The city does not exists");
				break;
			case 401:
				printError("The token is not valid. Try to update token -t [API_KEY]");
				break;
			default:
				printError(e.message);
		}
	}
};

const saveLanguage = async (language) => {
	if (!language.length) {
		printError("Language is missing");
		return;
	}

	const validLanguageKeys = ["en", "ru"];
	if (!validLanguageKeys.includes(language)) {
		printError("Language format is invalid");
		return;
	}

	try {
		await saveKeyValue(TOKEN_DICTIONARY.language, language);
		printSuccess("Language has been saved");
	} catch (e) {
		printError(e.message);
	}
};

const initCLI = () => {
	const args = getArgs(process.argv);

	if (args.h) {
		printHelp();
		return;
	}

	if (args.t) {
		saveToken(args.t);
		return;
	}

	if (args.c) {
		saveCity(args.c);
		return;
	}

	if (args.l) {
		saveLanguage(args.l);
		return;
	}

	getForecast();
};

const getForecast = async () => {
	try {
		const token = await getKeyValue(TOKEN_DICTIONARY.token);

		if (token === undefined) {
			printWarning(
				"The token is not specified. Try to setup token first -t [API_KEY]"
			);
			return;
		}

		const city = await getKeyValue(TOKEN_DICTIONARY.city);

		if (city === undefined) {
			printWarning(
				"The city is not specified. Try to setup city -c [CITY_NAME]"
			);
			return;
		}

		const weather = await getWeather(city);
		printWeather(weather);
	} catch (e) {
		switch (e?.response?.status) {
			case 404:
				printError("The city does not exists");
				break;
			case 401:
				printError("The token is not valid");
				break;
			default:
				printError(e.message);
		}
	}
};

initCLI();
