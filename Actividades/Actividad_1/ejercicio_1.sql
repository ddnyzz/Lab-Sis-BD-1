CREATE TABLE autor (
    id_autor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    nacionalidad VARCHAR(40),
    email VARCHAR(50),
    biografia VARCHAR(255)
);

CREATE TABLE libro (
    id_libro INT PRIMARY KEY AUTO_INCREMENT,
    nombre_libro VARCHAR(60) NOT NULL,
    genero VARCHAR(40),
    publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE editorial (
    id_editorial INT PRIMARY KEY AUTO_INCREMENT,
    nombre_editorial VARCHAR(60) NOT NULL,
    direccion VARCHAR(40),
    telefono VARCHAR(20)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(60) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(40)
);
