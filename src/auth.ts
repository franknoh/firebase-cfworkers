import app from './app';
import { verifyToken } from './util/jwt';

export default class auth {
	private readonly _app: app | null = null;
	private readonly _baseUrl: string = '';

	constructor(app: app) {
		this._app = app;
		this._baseUrl = `https://firestore.googleapis.com/v1beta1/projects/${app.project_id}/databases/(default)/documents`;
	}

	async getUidFromToken(token: string) {
		if (!this._app) {
			throw new Error('Auth not initialized');
		}
		return await verifyToken(token, this._app.project_id);
	}
}

export function getAuth(app: app) {
	return new auth(app);
}
