const deluxerToken = artifacts.require("Deluxer");

module.exports = function(deployed) {
  deployed.deploy(deluxerToken, "Deluxer", "DLX", 3, 10000000000);
}