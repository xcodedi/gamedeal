CREATE TABLE tb_product
(
    id          SERIAL           NOT NULL,
    brand       VARCHAR(255),
    model       VARCHAR(255),
    description VARCHAR(255),
    currency    VARCHAR(255),
    price       DOUBLE PRECISION NOT NULL,
    image       VARCHAR(255),
    CONSTRAINT pk_tb_product PRIMARY KEY (id)
);