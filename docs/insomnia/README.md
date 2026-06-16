## API Reference 

### Pedidos

#### GET /pedidos
- **Descrição**: Obtém uma lista de pedidos
- **Response**: Array de pedidos

#### POST /pedidos
- **Descrição**: Cria um novo pedido
- **Body**:
```
Exemplo:
{
    "idCliente": "DE2D1E90-0091-4203-8D13-9BEB51A90A4C",
    "dataPedido": "2025/10/03",
    "cargaPedido": "1",

}
```
- **Response**:
```
{
    "message": "Pedido cadastrado com sucesso!"
}
```

#### PUT /pedidos
- **Descrição**: Atualiza um pedido colocando o idCliente no path params

- **Body**:
```
Exemplo:
{

    "dataPedido": "2025/11/18",
    "":""
    "":""

}
```
- **Response**:
```
{
    "message": "Pedido atualizado com sucesso!"
}
```