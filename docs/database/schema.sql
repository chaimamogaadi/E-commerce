-- ============================================================
--  SMART E-COMMERCE — COMPLETE DATABASE SCHEMA
--  Engine: MySQL 8+  |  Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_ecommerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_ecommerce;

-- ------------------------------------------------------------
--  USERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id        BIGINT       NOT NULL AUTO_INCREMENT,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role      VARCHAR(20)  NOT NULL DEFAULT 'USER',   -- USER | ADMIN
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  PRODUCTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          BIGINT         NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)   NOT NULL,
  description VARCHAR(1000),
  price       DECIMAL(10,2)  NOT NULL,
  category    VARCHAR(100),
  color       VARCHAR(100),
  brand       VARCHAR(100),
  stock       INT            NOT NULL DEFAULT 0,
  image_url   VARCHAR(500),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  CART ITEMS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
  id         BIGINT NOT NULL AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity   INT    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  ORDERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id             BIGINT        NOT NULL AUTO_INCREMENT,
  user_id        BIGINT        NOT NULL,
  created_at     DATETIME      NOT NULL,
  total_amount   DECIMAL(10,2) NOT NULL,
  status         VARCHAR(30)   NOT NULL DEFAULT 'PENDING',
  items_snapshot TEXT,                                      -- JSON snapshot of ordered items
  PRIMARY KEY (id),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
--  SEED — ADMIN USER  (password = admin123)
-- ------------------------------------------------------------
INSERT INTO users (email, password, full_name, role) VALUES (
  'admin@shop.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Shop Admin',
  'ADMIN'
);

-- ------------------------------------------------------------
--  SEED — PRODUCTS (30 items)
-- ------------------------------------------------------------
INSERT INTO products (name, description, price, category, color, brand, stock, image_url) VALUES
('Blue Denim Jacket','Classic slim-fit blue denim jacket',45.99,'Jackets','Blue','LeviStyle',50,'https://placehold.co/400x400/4A90D9/ffffff?text=Blue+Denim+Jacket'),
('Red Leather Jacket','Premium red leather biker jacket',89.99,'Jackets','Red','MotoWear',20,'https://placehold.co/400x400/D94A4A/ffffff?text=Red+Leather+Jacket'),
('Black Bomber Jacket','Stylish black bomber jacket with ribbed cuffs',65.00,'Jackets','Black','UrbanEdge',35,'https://placehold.co/400x400/2C2C2C/ffffff?text=Black+Bomber'),
('Khaki Field Jacket','Durable khaki field jacket with cargo pockets',72.50,'Jackets','Khaki','OutdoorPro',28,'https://placehold.co/400x400/A89060/ffffff?text=Khaki+Jacket'),
('Navy Blue Trench Coat','Elegant navy trench coat, water-resistant',119.99,'Jackets','Blue','EliteWear',15,'https://placehold.co/400x400/1A2E6E/ffffff?text=Navy+Trench'),
('Black Fleece Hoodie','Comfortable black fleece hoodie with kangaroo pocket',34.99,'Hoodies','Black','UrbanComfort',100,'https://placehold.co/400x400/1C1C1C/ffffff?text=Black+Hoodie'),
('Grey Zip-Up Hoodie','Classic grey zip-up hoodie in soft cotton blend',39.99,'Hoodies','Grey','BasicCo',80,'https://placehold.co/400x400/909090/ffffff?text=Grey+Hoodie'),
('Red Pullover Hoodie','Bold red pullover hoodie with embroidered logo',44.99,'Hoodies','Red','SportZone',60,'https://placehold.co/400x400/C0392B/ffffff?text=Red+Hoodie'),
('White Oversized Hoodie','Trendy white oversized hoodie in heavyweight cotton',49.99,'Hoodies','White','StreetStyle',45,'https://placehold.co/400x400/F0F0F0/333333?text=White+Hoodie'),
('White Leather Sneakers','Clean minimalist white leather sneakers',59.99,'Shoes','White','StepUp',75,'https://placehold.co/400x400/FFFFFF/333333?text=White+Sneakers'),
('Black Running Shoes','Lightweight black running shoes with mesh upper',79.99,'Shoes','Black','RunFast',55,'https://placehold.co/400x400/111111/ffffff?text=Black+Runners'),
('Brown Leather Boots','Genuine brown leather ankle boots',95.00,'Shoes','Brown','BootCo',30,'https://placehold.co/400x400/7B4F2E/ffffff?text=Brown+Boots'),
('Red High-Top Sneakers','Bold red canvas high-top sneakers',54.99,'Shoes','Red','ClassicKicks',40,'https://placehold.co/400x400/C0392B/ffffff?text=Red+HiTop'),
('Navy Blue Loafers','Smart navy blue leather loafers',84.99,'Shoes','Blue','SmartStep',25,'https://placehold.co/400x400/1A2E6E/ffffff?text=Navy+Loafers'),
('Black Slim Chinos','Sharp black slim-fit chino trousers',44.99,'Pants','Black','FitWear',70,'https://placehold.co/400x400/1C1C1C/ffffff?text=Black+Chinos'),
('Green Cargo Pants','Utility green cargo pants with six deep pockets',49.99,'Pants','Green','OutdoorFit',60,'https://placehold.co/400x400/4A7C4A/ffffff?text=Green+Cargo'),
('Beige Linen Trousers','Relaxed beige linen trousers, breathable',52.00,'Pants','Beige','SummerCo',50,'https://placehold.co/400x400/D4C5A0/333333?text=Beige+Linen'),
('Blue Denim Jeans','Classic straight-fit blue denim jeans',55.00,'Pants','Blue','DenimKing',90,'https://placehold.co/400x400/3A6EA5/ffffff?text=Blue+Jeans'),
('Navy Blue T-Shirt','Premium 100% cotton navy crew-neck t-shirt',19.99,'T-Shirts','Blue','BasicCo',200,'https://placehold.co/400x400/1A2E6E/ffffff?text=Navy+Tee'),
('White Plain T-Shirt','Essential white t-shirt in organic cotton',17.99,'T-Shirts','White','EssentialsCo',180,'https://placehold.co/400x400/F8F8F8/333333?text=White+Tee'),
('Black Graphic T-Shirt','Black cotton t-shirt with minimalist graphic print',24.99,'T-Shirts','Black','GraphiTee',120,'https://placehold.co/400x400/111111/ffffff?text=Black+Tee'),
('Red Striped T-Shirt','Classic red and white horizontal striped t-shirt',22.99,'T-Shirts','Red','BretonStyle',85,'https://placehold.co/400x400/C0392B/ffffff?text=Red+Stripe+Tee'),
('Grey Wool Sweater','Warm merino wool grey crewneck sweater',69.99,'Sweaters','Grey','WoolCraft',40,'https://placehold.co/400x400/909090/ffffff?text=Grey+Sweater'),
('Navy Cable-Knit Sweater','Traditional navy cable-knit sweater in lambswool',79.99,'Sweaters','Blue','HeritageCo',30,'https://placehold.co/400x400/1A2E6E/ffffff?text=Navy+Knit'),
('Beige Turtleneck Sweater','Cosy beige ribbed turtleneck sweater, slim fit',64.99,'Sweaters','Beige','WarmCo',35,'https://placehold.co/400x400/D4C5A0/333333?text=Beige+Turtleneck'),
('Pink Summer Dress','Light floral pink midi dress for warm weather',39.99,'Dresses','Pink','BloomWear',45,'https://placehold.co/400x400/F4A7B9/ffffff?text=Pink+Dress'),
('Black Evening Dress','Elegant black sleeveless midi dress',89.99,'Dresses','Black','NightOut',20,'https://placehold.co/400x400/111111/ffffff?text=Black+Dress'),
('White Linen Dress','Casual white linen shirt dress with belted waist',55.00,'Dresses','White','SummerCo',38,'https://placehold.co/400x400/F8F8F8/333333?text=White+Dress'),
('Black Formal Suit','Classic two-piece black formal suit, tailored slim fit',149.99,'Suits','Black','EliteWear',15,'https://placehold.co/400x400/111111/ffffff?text=Black+Suit'),
('Navy Blue Business Suit','Sharp navy two-piece business suit in wool blend',179.99,'Suits','Blue','BoardroomCo',10,'https://placehold.co/400x400/1A2E6E/ffffff?text=Navy+Suit');