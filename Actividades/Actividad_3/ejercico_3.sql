CREATE TABLE categoria(
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_Categoria VARCHAR(50) NOT NULL
);

CREATE TABLE area(
    id_area INT PRIMARY KEY AUTO_INCREMENT,
    nombre_area VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE producto(
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(50) NOT NULL,
    cantidad_producto INT NOT NULL,
    precio_producto DECIMAL(10,2) NOT NULL,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE empleado(
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    nombre_empleado VARCHAR(50) NOT NULL,
    puesto VARCHAR(50),
    id_area INT,
    FOREIGN KEY (id_area) REFERENCES area(id_area)
);

CREATE TABLE cliente(
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE proveedor(
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre_proveedor VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE compra(
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    id_proveedor INT,
    fecha_compra DATE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
);

-----RELACION
CREATE TABLE producto_categoria(
    id_producto INT,
    id_categoria INT,
    PRIMARY KEY(id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE venta(
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    id_empleado INT,
    fecha_venta DATE,
    total DECIMAL(10,2),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);


-----RELACION
CREATE TABLE detalle_compra(
    id_compra INT,
    id_producto INT,
    cantidad INT,
    precio_compra DECIMAL(10,2),
    PRIMARY KEY(id_compra, id_producto),
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);


----RELACION
CREATE TABLE detalle_venta(
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_venta DECIMAL(10,2),
    PRIMARY KEY(id_venta, id_producto),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
