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
