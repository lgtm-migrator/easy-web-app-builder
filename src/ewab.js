
/**
 * @file
 * This is the main file/function for the entire package. It mostly just calls other functions in the correct order.
 */

import { ewabSourcePath } from "./tools.js";

import { log, bar } from "./log.js";
import config from "./config.js";
import cache from "./cache.js";
import files from "./files.js";
import minify from "./minify.js";
import icons from "./icons.js";
import serviceworker from "./serviceworker.js";

/**
 * Contains some shared objects and defaults that are used across this package.
 */
export const ewabRuntime = {
	sourcePath: ewabSourcePath,
	minifiedHashes: [],
};


/**
 * This function is called when EWAB starts.
 * It initiates global objects and controls the overall process.
 * 
 * @param	{object}	callConfig	- 
 */
export default async function (callConfig = {}){

	global.ewabRuntime = ewabRuntime;
	global.ewabConfig = {};

	global.ewabConfig = await config.generateMain(callConfig); //starts logging and calls bar.begin() as soon as possible

	bar(.6);

	await cache.ensure();

	bar(.8);

	await files.begin();

	bar.hide();


	await minify("remove");
	
	await icons.add();

	await minify("images");

	await serviceworker.link();

	await files.writeManifest();

	await minify("files");

	await serviceworker.add();


	bar.begin("Cooling down");

	await files.end();

	bar(.5);

	await cache.seal();

	bar.hide();
	log("modern-only", "");

}
