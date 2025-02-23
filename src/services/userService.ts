//import type { Client} from '@azure/identity';
//debug to find out what type we actually get here...

/**
 * e.g. 
 * { 
 *   identityProvider: "aad", 
 *   userId: "1234", 
 *   userDetails:  "username",
 *   userRoles: ["anonymous", "authenticated"],
 *   claims: [{
 *    typ: "name",
 *    val: "value of claim"}]
 * } * 
 * @returns {Promise<ClientPrincipal>}
 */
export async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }