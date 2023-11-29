import app from './app';
import { parseCollection, parseDocument, wrapDocument } from './util/parser';

export default class firestore {
	private readonly _app: app | null = null;
	private readonly _baseUrl: string = '';

	constructor(app: app) {
		this._app = app;
		this._baseUrl = `https://firestore.googleapis.com/v1beta1/projects/${app.project_id}/databases/(default)/documents`;
	}

	async getCollection(collection: string) {
		const response = await this.sendGetRequest(`${this._baseUrl}/${collection}`);
		return await parseCollection(response);
	}

	async getDocument(collection: string, document: string) {
		const response = await this.sendGetRequest(`${this._baseUrl}/${collection}/${document}`);
		return await parseDocument(response);
	}

	async postDocument(collection: string, doc: any, documentId: string | null = null) {
		let url = `${this._baseUrl}/${collection}`;
		if (documentId) {
			url += `?documentId=${documentId}`;
		}
		let body = {
			fields: wrapDocument(doc)
		};
		console.log(body);
		const response = await this.sendPostRequest(url, body);
		return await parseDocument(response);
	}

	private async sendGetRequest(url: string) {
		if (!this._app) {
			throw new Error('Firestore not initialized');
		}
		return await this._app.sendGetRequest(url);
	}

	private async sendPostRequest(url: string, body: any) {
		if (!this._app) {
			throw new Error('Firestore not initialized');
		}
		return await this._app.sendPostRequest(url, body);
	}
}

export function getFirestore(app: app) {
	return new firestore(app);
}
