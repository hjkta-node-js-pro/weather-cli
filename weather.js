#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getGeocodes, getWeather } from "./services/api.service.js";
import {
	printHelp,
	printSuccess,
	printError,
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
				printError(
					"The token is not valid. Try to setup token first -t [API_KEY]"
				);
				break;
			default:
				printError(e.message);
		}
	}
};

const initCLI = () => {
	const args = getArgs(process.argv);

	if (args.h) {
		printHelp();
	}

	if (args.t) {
		saveToken(args.t);
	}

	if (args.c) {
		saveCity(args.c);
	}

	getForecast();
};

const getForecast = async () => {
	try {
		const weather = await getWeather(await getKeyValue(TOKEN_DICTIONARY.city));
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
