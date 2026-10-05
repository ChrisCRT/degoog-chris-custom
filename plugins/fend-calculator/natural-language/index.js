const { detectLanguage } = require("./detector");
const { parse } = require("./parser");
const { normalise } = require("./normalise");
const { getLanguage } = require("./vocabulary");

module.exports = {
  detectLanguage,
  getLanguage,
  parse,
  normalise,
};
