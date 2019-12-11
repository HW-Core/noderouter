// @ts-ignore
require("../def/jsdoc");
var assert = require("assert");

const TTL = 6000;

/**
 * This class is used to ensure that data retrieved from clients
 * are valid.
 */
class ClientInfo {
  /**
   *
   * @param {ClientInfoObj} info
   */
  constructor({
    isLocal,
    connType,
    srcHost,
    dstHost,
    dstPort,
    srcPath,
    dstPath,
    isFailover = false,
    timeToLive = TTL,
    signature
  }) {
    // Following assertion are needed to validate network data
    assert(typeof isLocal === "boolean", "isLocal must be a boolean");
    assert(typeof isFailover === "boolean", "isFailover must be a boolean");
    assert(typeof connType === "number", "connType must be a number");
    assert(srcHost && typeof srcHost === "string", "srcHost must be a string");
    assert(dstHost && typeof dstHost === "string", "dstHost must be a string");
    assert(dstPort && typeof dstPort === "number", "dstPort must be a number");
    assert(
      signature && typeof signature === "string",
      "Signature must be a string"
    );
    assert(!srcPath || typeof srcPath === "string", "srcPath must be a string");
    assert(!dstPath || typeof dstPath === "string", "dstPath must be a string");
    assert(
      timeToLive && typeof timeToLive === "number",
      "timeToLive must be a number"
    );

    this.isLocal = isLocal;
    this.isFailover = isFailover;
    this.connType = connType;
    this.srcHost = srcHost;
    this.dstHost = dstHost;
    this.dstPort = dstPort;
    this.srcPath = srcPath && dstPath ? srcPath : "(.*)";
    this.dstPath = srcPath && dstPath ? dstPath : "$1";
    this.timeToLive = timeToLive;
    this.signature = signature;
    this.timer = Date.now();
  }

  refreshTimer() {
    this.timer = Date.now();
  }

  isExpired() {
    return this.timer + this.timeToLive < Date.now();
  }

  /**
   *
   * @param {string} url
   */
  getDestPathByUrl(url) {
    const r = new RegExp(this.srcPath);
    return url.replace(r, this.dstPath);
  }
}

module.exports = ClientInfo;
