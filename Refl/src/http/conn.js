const Conn = exports.Conn = {}

Conn.mockRequest = (method, url) => {
  return {
    method,
    url,
  }
}

Conn.mockResponse = () => {
  return {
    send: (str) => { this.response = str }
  }
}

Conn.mockConn = (method, url) => {
  return Conn.buildConn(Conn.mockRequest(method, url), Conn.mockResponse())
}

Conn.buildConn = (req, res) => {
  return { req, res }
}
