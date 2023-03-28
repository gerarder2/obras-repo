'use strict';
/* eslint-env es6 */
const fs = require('fs');

// Leemos el contenido de los archivos
const file1 = fs.readFileSync('./src/assets/markers/sinaloa_secciones.geojson', 'utf-8');
const file2 = fs.readFileSync('./src/assets/markers/seccionesxdistritos.json', 'utf-8');

// Convertimos el contenido de los archivos en objetos JavaScript
const data1 = JSON.parse(file1);
const data2 = JSON.parse(file2);

// Buscamos el objeto correspondiente en data1
const search = data2.search;
for (const element of data2) {
  const item = data1.items.find((item) => item.ID === search.idSeccion);

  // Modificamos el valor de "value" en el objeto encontrado
  if (item) {
    item.DISTRITO = element.idDistrito;
  }
}

// Guardamos los cambios en un nuevo archivo
const newData = JSON.stringify(data1);
fs.writeFileSync('newFile.geojson', newData);
