import jwt from '@tsndr/cloudflare-worker-jwt';
import { serviceAccountCredentials } from './types';
import serviceDefinition from './serviceDefinition.json';


export async function generateToken(serviceAccountCredentials: serviceAccountCredentials) {
	const iat = Math.floor(new Date().getTime() / 1000);
	const exp = iat + 60 * 60;

	const payload = {
		iat: iat,
		exp: exp,
		aud: `https://${serviceDefinition.name}/`,
		iss: serviceAccountCredentials.client_email,
		sub: serviceAccountCredentials.client_email
	};

	return {
		sign: await jwt.sign(payload, serviceAccountCredentials.private_key, { algorithm: 'RS256' }),
		exp: exp
	};
}

async function getPublicKey() {
	const response = await fetch(`https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`);
	const json = await response.json();
	return json as { [key: string]: string };
}

export async function verifyToken(token: string, project_id: string) {
	const publicKeys = await getPublicKey();
	const decoded = jwt.decode(token);
	if (!decoded || !decoded.header || !decoded.payload) {
		return '';
	}
	const header = decoded.header as { alg: string, kid: string };
	const payload = decoded.payload as {
		aud: string,
		iss: string,
		sub: string,
		iat: number,
		exp: number,
		auth_time: number
	};
	if (header.alg !== 'RS256') {
		return '';
	}
	if (payload.iat > Math.floor(new Date().getTime() / 1000) || payload.exp < Math.floor(new Date().getTime() / 1000) || payload.auth_time > Math.floor(new Date().getTime() / 1000)) {
		return '';
	}
	if (payload.aud !== project_id || payload.iss !== `https://securetoken.google.com/${project_id}` || payload.sub === '') {
		return '';
	}
	const publicKey = publicKeys[header.kid];
	if (!publicKey) {
		return '';
	}
	if (await jwt.verify(token, publicKey)) {
		return payload.sub;
	}
	return '';
}
