create database dindin;

create table usuarios (
id serial primary key,
nome text,
email text unique,
senha text
)

create table categorias (
id serial primary key,
usuario_id integer references usuarios(id),
descricao text
)

create table transacoes (
id serial primary key,
descricao text,
valor integer,
data date,
categoria_id integer references categorias(id),
usuario_id integer references usuarios(id),
tipo text
)