/**
 * Plugin to send JSON requests with body data on apidoc inline documentations
 *
 * Apidoc Hooks: https://github.com/apidoc/apidoc-core/hooks.md
 */
var app = {};

module.exports = {

    init: function(_app) {
		app = _app;

        //
        // Hook
        //
		app.addHook('parser-find-element-apirequest', parserRequest);

        //
        // Add Parsers
        //
		app.parsers.apirequest = {
			parse: parseRequest,
			path: 'local',
			method: 'insert'
		};
    }

};


/**
 * Add local url to app object in case of user don't specify url
 */
function parserRequest(element, block, filename) {
	app.localUrl = block.match(/^(@api).\S+.\S+/g)[0].split(" ")[2];
	return element;
}


/**
 * Simple parser. Add request with URL and application type object to tree.
 * Examples: https://github.com/apidoc/apidoc-core/tree/master/lib/parsers
 */
function parseRequest(content) {
	const params = content.split(" ");

	const type = params[0].match(/[a-zA-Z0-9]/g).join("");

	const info = {
		appType: "form/data",
	};
	
	if (params[1]) {
		info.url = params[1];
	} else {
		info.url = `${app.packageInfos.sampleUrl}${app.localUrl}`;
	}

	if (type.toLowerCase() === "json") info.appType = "application/json";

	return {
		request: info
	};
}
