require("../def/jsdoc");
const ClientInfo = require("./ClientInfo");
var assert = require("assert");

class Router {
  /**
   * Initialize the router
   * @param {number} localport
   */
  constructor(localport, type) {
    /**@type {Object.<string,Object.<string,ClientInfo>>} - client map of hostname -> info*/
    this.clients = {};
    /**@type {string} - type name of created router */
    this.type = type;
    /**@type {number} - listening port for the tunnel */
    this.localport = localport;

    this.srvHandler = null;
  }

  getRouterPort() {
    return this.srvHandler.address().port;
  }

  getRouterHost() {
    return this.srvHandler.address().address;
  }

  /**
   * Get list of registered clients on source host
   * @param {string} srcHost
   * @returns {Object.<string,ClientInfo>} - clients information
   */
  getClients(srcHost) {
    return this.clients[srcHost];
  }

  /**
   * Get registered client by its signature
   * @param {string} srcHost
   * @param {string} signature
   * @returns {ClientInfo} - client information
   */
  getClientBySignature(srcHost, signature) {
    const clients = this.clients[srcHost];

    if (!clients) return null;

    return clients[signature];
  }

  /**
   * Get registered client by paths match
   * @param {string} srcHost
   * @param {string} srcPath
   * @returns {ClientInfo} - client information
   */
  getClientBySrcPath(srcHost, srcPath) {
    const clients = this.clients[srcHost];

    for (var k in clients) {
      let client = clients[k];
      var r = new RegExp(client.srcPath);
      if (r.test(srcPath) || srcPath.startsWith(client.srcPath)) return client;
    }

    return null;
  }

  /**
   * set a client in router list
   * @param {ClientInfo} clientInfo
   */
  setClient(clientInfo) {
    assert(clientInfo instanceof ClientInfo);

    if (!this.clients[clientInfo.srcHost])
      this.clients[clientInfo.srcHost] = {};

    this.clients[clientInfo.srcHost][clientInfo.signature] = clientInfo;
  }

  /**
   * remove a client from the router list
   * @param {ClientInfo} clientInfo
   */
  removeClient(clientInfo) {
    assert(clientInfo instanceof ClientInfo);

    if (!this.clients[clientInfo.srcHost]) return;

    delete this.clients[clientInfo.srcHost][clientInfo.signature];
  }

  /**
   * Register a client on router
   * @param {ClientInfo} clientInfo
   */
  register(clientInfo) {
    assert(clientInfo instanceof ClientInfo);

    const client = this.getClientBySignature(
      clientInfo.srcHost,
      clientInfo.signature
    );

    if (client) return 200;

    this.setClient(clientInfo);

    console.debug(
      `Registered ${this.type} tunnel: ${
        clientInfo.srcHost
      }:${this.getRouterPort()} <==> ${clientInfo.dstHost}:${
        clientInfo.dstPort
      }`
    );

    //return client ? 205 : 201;
    return 201;
  }

  /**
   * Remove a client from the router
   * @param {ClientInfo} clientInfo
   */
  unregister(clientInfo) {
    assert(clientInfo instanceof ClientInfo);

    this.removeClient(clientInfo);

    console.debug(
      `Unregistered ${this.type} tunnel: ${
        clientInfo.srcHost
      }:${this.getRouterPort()} <==> ${clientInfo.dstHost}:${
        clientInfo.dstPort
      }`
    );

    return 200;
  }
}

module.exports = Router;