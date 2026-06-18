/* database.sql */
CREATE DATABASE IF NOT EXISTS `pastimes_db2`;
USE `pastimes_db2`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

CREATE TABLE `users` (
  `userId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `passwordHash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `role` enum('buyer','seller','admin') DEFAULT 'buyer',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
  `productId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `condition_status` varchar(100) DEFAULT NULL,
  `colour` varchar(100) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `status` enum('available','sold') DEFAULT 'available',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `carts` (
  `cartId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `messages` (
  `messageId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`senderId`) REFERENCES `users` (`userId`),
  FOREIGN KEY (`receiverId`) REFERENCES `users` (`userId`),
  FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data with affordable ZAR prices and Sneakers
INSERT INTO `users` (`fullName`, `email`, `passwordHash`, `role`) VALUES 
('Thabo Maboso', 'thabo@example.co.za', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller'),
('Administrator', 'admin@pastimes.co.za', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO `products` (`userId`, `name`, `description`, `price`, `size`, `category`, `brand`, `condition_status`, `colour`, `imageUrl`) VALUES 
(1, 'Vintage Corduroy Shirt', 'Premium brown corduroy piece.', 180.00, 'M', 'Menswear', 'Vintage', 'Excellent', 'Brown', 'https://images.unsplash.com/photo-1588731247530-4076fc9919a4?q=80&w=687&auto=format&fit=crop'),
(1, '90s High-Waist Denim', 'Classic retro denim wash.', 250.00, '30', 'Womenswear', 'Levis', 'Great', 'Blue', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=687&auto=format&fit=crop'),
(1, 'Retro Shell Jacket', 'Vibrant 80s style athletic jacket.', 320.00, 'L', 'Outerwear', 'Adidas', 'Good', 'Multicolor', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=735&auto=format&fit=crop'),
(1, 'Air Jordan 1 Mid', 'Original style classic sneakers.', 1200.00, 'UK 9', 'Sneakers', 'Jordan', 'Excellent', 'Red/White', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1470&auto=format&fit=crop'),
(1, 'Yeezy Boost 350', 'Cream white colorway, very comfortable.', 1500.00, 'UK 10', 'Sneakers', 'Adidas', 'Near New', 'Cream', 'https://images.unsplash.com/photo-1584735174914-6b1272458e3e?q=80&w=687&auto=format&fit=crop'),
(1, 'Oversized Graphic Tee', 'Local boutique thrift find.', 85.00, 'XL', 'Menswear', 'Streetwear', 'Good', 'Grey', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=687&auto=format&fit=crop'),
(1, 'Vintage Nike Dunks', 'Rare classic release dunks.', 950.00, 'UK 8', 'Sneakers', 'Nike', 'Fair', 'Green', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=687&auto=format&fit=crop'),
(1, 'Heritage Wool Coat', 'Double-breasted vintage wool coat for winter.', 450.00, 'L', 'Menswear', 'Heritage', 'Excellent', 'Camel', 'https://images.unsplash.com/photo-1539533377285-b9dfb0ee4cbe?q=80&w=687&auto=format&fit=crop'),
(1, 'Streetwear Cargoes', 'Multi-pocket tactical pants in khaki.', 220.00, '32', 'Menswear', 'Utility', 'Great', 'Khaki', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=687&auto=format&fit=crop'),
(1, 'Silk Party Dress', '90s style emerald silk slip dress.', 350.00, 'S', 'Womenswear', 'Luxury', 'Near New', 'Emerald', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c65c?q=80&w=687&auto=format&fit=crop'),
(1, 'Oversized Blazer', 'Boxy fit vintage power blazer.', 280.00, 'M', 'Womenswear', 'Vintage', 'Excellent', 'Grey Checks', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=687&auto=format&fit=crop'),
(1, 'NB 550 Vintage', 'Cream and green New Balance retro basketball shoes.', 1100.00, 'UK 7', 'Sneakers', 'New Balance', 'Great', 'Cream/Green', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074&auto=format&fit=crop'),
(1, 'Classic Trench Coat', 'Timeless beige trench for drizzly days.', 400.00, 'M', 'Womenswear', 'Burberry-Style', 'Good', 'Beige', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=736&auto=format&fit=crop'),
(1, 'Retro Varsity Jacket', 'Blue and yellow college style leather sleeve jacket.', 550.00, 'XL', 'Menswear', 'Athletic', 'Good', 'Blue/Yellow', 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=687&auto=format&fit=crop');

COMMIT;
