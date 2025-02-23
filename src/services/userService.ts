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
    //console.log("response", response);
    const payload = await response.json();
    //console.log("payload", payload);
    const { clientPrincipal } = payload;
    //console.log("clientPrincipal", clientPrincipal);
    return clientPrincipal;
  }