import Echo from "laravel-echo";
import { environment } from "src/environments/environment";

export const URL_BACKEND = environment.URL_BACKEND;
export const URL_SERVICIOS = environment.URL_SERVICIOS;
export const URL_FRONTEND = environment.URL_FRONTEND;

export function ECHO_PUSHER (token:any){
  return new Echo ({
      broadcaster: 'pusher',
      encrypted: false,
      cluster: 'mt1',
      key: 'ASDEFGRG1231',
      wsHost: environment.HOST_BACKEND,
      wsPort: 6001,
      wssPort: 443,
      forceTLS: false,
      disableStats: true,
      // enabledTransports: ['ws', 'wss'],
      authEndpoint: `${URL_SERVICIOS}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
}
