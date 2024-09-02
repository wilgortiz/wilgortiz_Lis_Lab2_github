/*
//middleware
var jwt = require("jsonwebtoken");
var express = require("express");

function authToken(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);
  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7) : token;
  }

  if (!token) {
    console.log('No hay token')
    return res.redirect("/login");
  }

  // Verificar el token JWT laboratoryDario
  jwt.verify(token, "laboratoryDario", (error, decoded) => {
    if (error) {
      console.log("Token inválido");
      res.redirect("/login");
    }else{

      
      // El token es válido, y los datos del usuario están en `decoded`
      req.usuario = decoded; // Almacenar los datos del usuario en el objeto "req" para su uso posterior
      next();
    }
  });
}

module.exports = authToken;
*/


/*

//MEJORA
var jwt = require("jsonwebtoken");
var express = require("express");

function authToken(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);
  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7) : token;
  }

  if (!token) {
    console.log('No hay token');
    return res.status(401).json({ message: "No token provided" });
  }

  // Verificar el token JWT
  jwt.verify(token, "laboratoryDario", (error, decoded) => {
    if (error) {
      console.log("Token inválido");
      return res.status(403).json({ message: "Invalid token" });
    } else {
      // El token es válido, y los datos del usuario están en `decoded`
      req.usuario = decoded; // Almacenar los datos del usuario en el objeto "req" para su uso posterior
      next();
    }
  });
}

module.exports = authToken;
*/

/*
//funcionando sin pacientes anda bien
const jwt = require("jsonwebtoken");
const express = require("express");

function authToken(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);
  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7) : token;
  }

  if (!token) {
    console.log('No hay token');
    return res.status(401).json({ message: "No token provided" });
  }

  // Verificar el token JWT
  jwt.verify(token, "laboratoryDario", (error, decoded) => {
    if (error) {
      console.log("Token inválido");
      return res.status(403).json({ message: "Invalid token" });
    } else {
      // El token es válido, y los datos del usuario están en `decoded`
      req.usuario = decoded; // Almacenar los datos del usuario en el objeto "req" para su uso posterior
      next();
    }
  });
}

module.exports = authToken;
*/





// middleware/auth.js
var jwt = require("jsonwebtoken");
var express = require("express");

function authToken(req, res, next) {
  let token = req.headers.authorization;
  console.log(token);

  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7) : token;
  }

  if (!token) {
    console.log('No hay token');
    return res.status(401).json({ message: "No token provided" });
  }

  // Verificar el token JWT
  jwt.verify(token, "wilgonzaLab2", (error, decoded) => {
    if (error) {
      console.log("Token inválido");
      return res.status(403).json({ message: "Invalid token" });
    } else {
      // El token es válido, y los datos del usuario están en `decoded`
      console.log("Token válido, datos decodificados:", decoded);
      req.usuario = decoded; // Almacenar los datos del usuario en el objeto "req" para su uso posterior
      next();
    }
  });
}

module.exports = authToken;
