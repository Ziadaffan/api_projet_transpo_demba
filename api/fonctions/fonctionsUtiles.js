"use strict";
// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {*} message message de l'erreur
 * @param {*} nom le nom de l'erreur
 * @param {*} code le code de l'erreur
 */
function gererException(message, nom, code) {
  const err = new Error(message);
  err.name = nom;
  err.statusCode = code;
  return err;
}

/**
 * 
 * @param {*} x 
 * @returns 
 */
function compterNombreJour(x) {
  // Limiter x à 8
/*   if (x > 8) {
      x = 8;
  } */
  return x*x + x + 1;
}

exports.compterNombreJour = compterNombreJour;
exports.gererException = gererException;