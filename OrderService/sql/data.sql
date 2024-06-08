DELETE FROM orders;

INSERT INTO orders(id, account_id, order_date) VALUES ('949ce4c5-3193-475b-b537-210d78c6c53e','4669b4d8-6116-492c-9b0c-22728eb75186', '2024-06-08 04:12:36.361');
INSERT INTO orderDetails(order_id, product_id, quantity) VALUES ('949ce4c5-3193-475b-b537-210d78c6c53e', '01dcf491-4ad3-432d-86cc-62e70465cafb', 1);