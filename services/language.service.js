import { promises } from "fs";

const isExists = async (path) => {
	try {
		await promises.stat(path);

		return true;
	} catch (e) {
		return false;
	}
};

const getLangValue = async (key, lang) => {
	const filePath = `./localization/${lang}.json`;

	if (await isExists(filePath)) {
		const file = await promises.readFile(filePath);
		const data = JSON.parse(file);

		return data[key];
	}

	return undefined;
};

export { getLangValue };
