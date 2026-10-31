CREATE TABLE tb_profile (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bio VARCHAR(1000),
    avatar_url VARCHAR(500),
    city VARCHAR(255),
    member_since VARCHAR(50),
    rating DOUBLE PRECISION DEFAULT 0,
    total_deals INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);
