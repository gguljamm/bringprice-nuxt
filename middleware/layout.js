export default (context) => {
  const con = context;
  // console.log(con);
  // console.log(context);
  // console.log(process.server);
  // console.log(con.req.headers.cookie);
  con.userAgent = process.server ? con.req.headers['user-agent'] : navigator.userAgent;
  if (con.userAgent.match(/Android/i)
    || con.userAgent.match(/webOS/i)
    || con.userAgent.match(/iPhone/i)
    || con.userAgent.match(/iPad/i)
    || con.userAgent.match(/iPod/i)
    || con.userAgent.match(/BlackBerry/i)
    || con.userAgent.match(/Windows Phone/i)) {
    con.store.state.isMobile = true;
  } else {
    con.store.state.isMobile = false;
  }
};
