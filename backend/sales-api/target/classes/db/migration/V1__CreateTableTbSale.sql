CREATE TABLE tb_sale (
    id SERIAL PRIMARY KEY,
    buyer_id VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    seller_name VARCHAR(255),
    status VARCHAR(50),
    amount DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image VARCHAR(500),
    description VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
