create database JWTAuthentication;

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(8) NOT NULL
);

insert into users (user_name, email, password) 
values
('test01', 'test1@email.com', '123test');

