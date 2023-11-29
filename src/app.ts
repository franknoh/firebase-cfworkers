import * as jwt from './util/jwt';
import { serviceAccountCredentials } from './util/types';

export default class app {
	public project_id: string = '';
	private _initialized: boolean = false;
	private _jwt: string = '';
	private _exp: number = 0;
	private _credentials: serviceAccountCredentials | null = null;

	public async initializeApp(serviceAccountCredentials: serviceAccountCredentials) {
		if (this._exp < Math.floor(new Date().getTime() / 1000)) {
			this._initialized = false;
		}
		if (this._initialized) {
			return this._jwt;
		}
		const sign = await jwt.generateToken(serviceAccountCredentials);
		this._jwt = sign.sign;
		this._exp = sign.exp;
		this._initialized = true;
		this._credentials = serviceAccountCredentials;
		this.project_id = serviceAccountCredentials.project_id;
		return this._jwt;
	}

	async sendGetRequest(url: string) {
		await this.initializeApp(this._credentials as serviceAccountCredentials);
		return await fetch(url, {
			method: 'GET',
			body: null,
			headers: {
				'Authorization': 'Bearer ' + this._jwt
			}
		});
	}

	async sendPostRequest(url: string, data: any) {
		await this.initializeApp(this._credentials as serviceAccountCredentials);
		return await fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this._jwt
			}
		});
	}
}

export function getApp() {
	return new app();
}
