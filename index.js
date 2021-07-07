const ldap = require("ldapjs");
const client = ldap.createClient({
  url: ["ldap://***"],
});
let ob = console;

client.on("connect", () => {
  // handle connection error
  ob.log("Hello");
  client.bind("cn=admin,dc=ldapmaster,dc=obto,dc=com", "**,", (err) => {
    if (err) {
      ob.log(`Error in binding ${err}`);
    } else {
      listUsers();
    }
  });
});

const listUsers = () => {
  const opts = {
    filter: "(objectclass=person)",
    scope: "sub",
  };
  client.search("dc=ldapmaster,dc=obto,dc=com", opts, (err, res) => {
    if (err) {
      ob.log("Search Failed " + err);
    } else {
      res.on("searchEntry", (entry) => {
        ob.log("entry: " + JSON.stringify(entry.object));
      });
      res.on("searchReference", (referral) => {
        ob.log("referral: " + referral.uris.join());
      });
      res.on("error", (err) => {
        ob.error("error: " + err.message);
      });
      res.on("end", (result) => {
        ob.log("status: " + result.status);
      });
    }
  });
};
