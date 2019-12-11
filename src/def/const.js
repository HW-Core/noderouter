module.exports = {
  TLS_ROUTER_PORT: 443,
  HTTP_ROUTER_PORT: 80,
  API_PORT: 4010,
  /**
   * Enum for connection types
   * @readonly
   * @enum {number}
   */
  CONN_TYPE: {
    /** define an http -> service (http) proxy with path support */
    HTTP_HTTP_PROXY: 1,
    /** define a tls -> https -> service (on https) proxy with path support */
    HTTPS_HTTPS_PROXY: 2,
    /** define a tls -> https -> service (on http) proxy with path support */
    HTTPS_HTTP_PROXY: 3,
    /** define a tls -> service a TCP tunnel with TLS, SNI & SSL Passthrough support, but no proxy path possible */
    TLS_TUNNEL: 4
  },
  /**
   * Enum for client priority
   * @readonly
   * @enum {number}
   */
  CLIENT_PRIORITY: {
    /** If exists, a failover client will be used when primary is not available */
    FAILOVER: 0,
    /** Primary priority is the standard value for all clients */
    PRIMARY: 1
  }
};
