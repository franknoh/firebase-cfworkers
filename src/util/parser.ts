function recursiveParse(obj: any) {
	let keys = Object.keys(obj);
	let res: any = {};
	for (let key of keys) {
		switch (Object.keys(obj[key])[0]) {
			case 'stringValue':
				res[key] = obj[key].stringValue;
				break;
			case 'integerValue':
				res[key] = obj[key].integerValue;
				break;
			case 'booleanValue':
				res[key] = obj[key].booleanValue;
				break;
			case 'timestampValue':
				res[key] = obj[key].timestampValue;
				break;
			case 'nullValue':
				res[key] = null;
				break;
			case 'arrayValue':
				res[key] = recursiveParse(obj[key].arrayValue.values);
				break;
			case 'mapValue':
				res[key] = recursiveParse(obj[key].mapValue.fields);
				break;
			default:
				break;
		}
	}
	return res;
}

export async function parseDocument(res: Response) {
	let response = await res.json() as any;
	if ('error' in response) {
		return response;
	}
	let fields = response.fields;
	response.fields = recursiveParse(fields);
	return response;
}

export async function parseCollection(res: Response) {
	let response = await res.json() as any;
	if ('error' in response) {
		return response;
	}
	let documents = response.documents;
	response.documents = [];
	for (let document of documents) {
		let fields = document.fields;
		document.fields = recursiveParse(fields);
		response.documents.push(document);
	}
	return response;
}

function recursiveWrap(obj: any) {
	if (Array.isArray(obj)) {
		let res: any = [];
		for (let item of obj) {
			switch (typeof item) {
				case 'string':
					res.push({ stringValue: item });
					break;
				case 'number':
					res.push({ integerValue: item });
					break;
				case 'boolean':
					res.push({ booleanValue: item });
					break;
				case 'object':
					if (item === null) {
						res.push({ nullValue: null });
					} else if (Array.isArray(item)) {
						res.push({ arrayValue: { values: recursiveWrap(item) } });
					} else {
						res.push({ mapValue: { fields: recursiveWrap(item) } });
					}
					break;
				default:
					break;
			}
		}
		return res;
	}
	let keys = Object.keys(obj);
	let res: any = {};
	for (let key of keys) {
		switch (typeof obj[key]) {
			case 'string':
				res[key] = { stringValue: obj[key] };
				break;
			case 'number':
				res[key] = { integerValue: obj[key] };
				break;
			case 'boolean':
				res[key] = { booleanValue: obj[key] };
				break;
			case 'object':
				if (obj[key] === null) {
					res[key] = { nullValue: null };
				} else if (Array.isArray(obj[key])) {
					res[key] = { arrayValue: { values: recursiveWrap(obj[key]) } };
				} else {
					res[key] = { mapValue: { fields: recursiveWrap(obj[key]) } };
				}
				break;
			default:
				break;
		}
	}
	return res;
}

export function wrapDocument(obj: any) {
	return recursiveWrap(obj);
}
