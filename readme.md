# API - Sistema DinDin
Minha primeira API REST simulando algumas operações bancárias. Esta API permite que você cadastre usuários, faça login com autenticação e detalhe informações do usuario logado, além de: listar categoria, detalhar,
cadastrar e muitas outras. Abaixo estão todos endpoints disponíveis.

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Este endpoint permite cadastrar um novo usuário no sistema, com criptografia da senha usando a biblioteca bcrypt.

**Parâmetros body**

    -   nome
    -   email
    -   senha

### **Login do usuário**

#### `POST` `/login`

Este endpoint permite que um usuário faça login e obtenha um token de autenticação com a biblioteca jsonwebtoken.

**Parâmetros body**

    -   email
    -   senha


### **Detalhar usuário**

#### `GET` `/usuario`

Este endpoint retorna detalhes do perfil do usuário logado, com base no token de autenticação.

### **Editar usuário**

#### `PUT` `/usuario`

Este endpoint permite ao usuário logado editar os detalhes do seu perfil.

**Parâmetros body**

    -   nome
    -   email
    -   senha
## A partir daqui o usuário deve estar logado para obter acesso aos endpoints

### **Listar categorias do usuário**

#### `GET` `/categoria`

Este endpoint retorna uma lista de categorias relacionadas ao usuario logado.

### **Detalhar uma categoria do usuário**

#### `GET` `/categoria/:id`

Este endpoint retorna a categoria com base no ID passado na rota.

### **Cadastrar categoria para o usuário**

#### `POST` `/categoria`

Este endpoint permite cadastrar uma nova categoria.

**Parâmetros body**

    -   descricao

#### `PUT` `/categoria/:id`

Este endpoint permite ao usuário editar a descrição de uma categoria existente com base no ID passado na rota.

**Parâmetros body**

    -   descricao

### **Excluir categoria do usuário**

#### `DELETE` `/categoria/:id`

Este endpoint permite remover uma categoria existente com base no ID passado na rota.

### **Listar transações ou Filtrar transações por categoria**

#### `GET` `/transacao`  ( filtro opcional )

Este endpoint retorna uma lista de transações realizadas pelo usuário logado e caso ele queira filtrar por tipo de transações so passar um query **?filtro=entrada ou ?filtro=saida**.

### **Detalhar uma transação**

#### `GET` `/transacao/:id`

Este endpoint retorna uma transação detalhada com base no ID passado na rota.

### **Cadastrar transação**

#### `POST` `/transacao`

Este endpoint permite cadastrar uma nova transação.

**Parâmetros body**

    -   tipo
    -   descricao
    -   valor
    -   data
    -   categori_id

### **Editar transação**

#### `PUT` `/transacao/:id`

Este endpoint permite ao usuário editar os detalhes de uma transação existente com base no ID passado na rota.

    -   tipo
    -   descricao
    -   valor
    -   data
    -   categori_id

### **Excluir transação**

#### `DELETE` `/transacao/:id`

Este endpoint permite remover uma transação existente com base no ID da passado na rota.

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Este endpoint retorna o extrato de transações do usuário logado.

##  
