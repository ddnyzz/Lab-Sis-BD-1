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
    publicacion DATE
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

CREATE TABLE prestamos (
    id_libro INT,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE reserva (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_libro INT,
    fecha_reserva DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE publicacion (
    id_libro INT,
    id_editorial INT,
    FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE autor_libro (
    id_autor INT,
    id_libro INT,
    PRIMARY KEY (id_autor, id_libro),
    FOREIGN KEY (id_autor) REFERENCES autor(id_autor),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
); 


------------------------------------------------


INSERT INTO autor(nombre, nacionalidad, biografia, email)
VALUES
('Daniela', 'mexicana', 'soy dani', 'dani@gmail.com'),
('Yajmin', 'mexicana', 'es yajmin', 'yajmin@gmail.com');

INSERT INTO libro(nombre_libro, genero, publicacion)
VALUES
('Diario de SAna Frank', 'autobiografia', '1947-06-25'),
('Leyendas de Aguascalientes', 'misterio', '2014-10-15');

INSERT INTO editorial(nombre_editorial, direccion, telefono)
VALUES
('Editorial Contact', 'Prinsengracht 795-97, Amsterdam', '5551111'),
('Editorial Epoca', 'Av. Emperadores 185, CDMX', '5556049046');

INSERT INTO usuario(nombre_usuario, telefono, direccion)
VALUES
('Juan Perez', '555-1234', 'Calle 789, Ciudad'),
('Ana Gomez', '555-5678', 'Avenida 321, Ciudad');


INSERT INTO autor_libro(id_autor, id_libro) VALUES(1,1),(2,2);

INSERT INTO prestamos(id_libro, id_usuario)
VALUES(1,1);


INSERT INTO reserva(id_usuario, id_libro, fecha_reserva)
VALUES(1,1,'2026-02-20');


INSERT INTO publicacion(id_libro, id_editorial)
VALUES(1,1);


SELECT
    l.nombre_libro,
    a.nombre AS autor,
    a.nacionalidad
FROM libro l
JOIN autor_libro al
    ON l.id_libro = al.id_libro
JOIN autor a
    ON al.id_autor = a.id_autor;

SELECT
    u.nombre_usuario,
    l.nombre_libro
FROM prestamos p
JOIN usuario u
    ON p.id_usuario = u.id_usuario
JOIN libro l
    ON p.id_libro = l.id_libro;

SELECT nombre
FROM autor
ORDER BY id_autor;

SELECT * FROM autor;
SELECT * FROM libro;
SELECT * FROM editorial;
SELECT * FROM usuario;
SELECT * FROM autor_libro;
SELECT * FROM prestamos;
SELECT * FROM reserva;
SELECT * FROM publicacion;
