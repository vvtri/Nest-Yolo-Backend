export const reduceProductAmount = `
UPDATE product
 SET amount = amount - cart.quantity
 FROM cart 
 WHERE product.id = "cart"."productId" AND cart."userId" = $1
`

export const getOrderQuery = `
SELECT "order".* , SUM(order_detail.quantity * product.price) 
 FROM "order"
 INNER JOIN order_detail on "order".id = order_detail."orderId"
 INNER join product on order_detail."productId" = product.id
 WHERE "order"."userId" = $1
 GROUP BY "order".id
`

export const changeQuantityQuery = `
UPDATE cart
 SET quantity = quantity + $1
 FROM product 
 WHERE product.id = cart."productId" 
	 AND cart."userId" = $2
	 AND cart."productId" = $3
	 AND quantity + $1 > 0 
	 AND quantity + $1 <= amount
`
