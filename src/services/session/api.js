import { Buffer } from 'buffer';
import { fetchApi } from '../api';
import apiConfig from '../api/config';

const endPoints = {
	authenticate: '/login',
	tracetrack: '/in/sandbox/1/track-trace',	
	revoke: '/users/auth/revoke',
	refresh: '/refresh-token',
};
export const authenticate = (usr, pwd) => fetchApi(endPoints.authenticate, { user: { email: usr, password: pwd } }, 'post', { });
export const tracetrack = (noresi) => fetchApi(endPoints.tracetrack, { resi: noresi }, 'post', {
	// Authorization: `Basic ${new Buffer(`${email}:${password}`).toString('base64')}`,
	// Authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9leG1sLmNvLmlkOjkwODhcL2FwaVwvdjFcL21vYmlsZVwvbG9naW4iLCJpYXQiOjE1MzczMjk3NzksImV4cCI6MTUzNzMzMzM3OSwibmJmIjoxNTM3MzI5Nzc5LCJqdGkiOiI4YllmbnVqemJzMlNjWUtpIiwic3ViIjoibWFtYW4iLCJwcnYiOiJjNjIwZmJjZWUxNDY4NThhZDYyYmEyZWZlNTE3MzYyNzQ4MjdiN2M0In0.IK76gqjr0s-JUtfwi1YScR8azy7rGUI56xuJjF2MNYw',
});
export const refresh = (token) => fetchApi(endPoints.refresh, { token: token }, 'post', { });
// export const refresh = (username, password) => fetchApi(endPoints.refresh, {username, password}, 'post', {
	// 'Client-ID': apiConfig.clientId,
	// Authorization: null,
// });

export const revoke = tokens => fetchApi(endPoints.revoke, { tokens }, 'post');
