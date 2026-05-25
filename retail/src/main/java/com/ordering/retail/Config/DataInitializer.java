package com.ordering.retail.Config;

import java.util.List;

import com.ordering.retail.Entity.Product;
import com.ordering.retail.Entity.Inventory;
import com.ordering.retail.Entity.User;
import com.ordering.retail.Enum.Role;
import com.ordering.retail.Repository.InventoryRepository;
import com.ordering.retail.Repository.ProductRepository;
import com.ordering.retail.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Initialize demo users if they don't exist
            if (userRepository.count() == 0) {
                User admin = new User("Admin User", "admin@retailos.com", passwordEncoder.encode("Admin@1234"), "9876543210", "123 Admin St", Role.ADMIN);
                User user1 = new User("John Doe", "john@retailos.com", passwordEncoder.encode("User@1234"), "9876543211", "456 User Ave", Role.USER);
                User user2 = new User("Jane Smith", "jane@retailos.com", passwordEncoder.encode("User@1234"), "9876543212", "789 Smith Rd", Role.USER);
                
                userRepository.save(admin);
                userRepository.save(user1);
                userRepository.save(user2);
            }

            // Initialize demo products if they don't exist
            if (productRepository.count() == 0) {
                List<Product> seededProducts = List.of(
                        new Product("Premium Wireless Headphones", 2999.0),
                        new Product("USB-C Fast Charger", 799.0),
                        new Product("Phone Screen Protector (Pack of 3)", 499.0),
                        new Product("Portable Power Bank 20000mAh", 1799.0),
                        new Product("Bluetooth Speaker", 1499.0),
                        new Product("Phone Case Protective", 599.0),
                        new Product("Wireless Mouse", 899.0),
                        new Product("USB Hub 7-Port", 1299.0),
                        new Product("HDMI Cable 2m", 399.0),
                        new Product("Laptop Stand Adjustable", 1599.0),
                        new Product("Olive Oil Premium 500ml", 449.0),
                        new Product("Basmati Rice 1kg", 299.0),
                        new Product("Dark Chocolate Bar 100g", 199.0),
                        new Product("Almond Nuts 250g", 399.0),
                        new Product("Green Tea Bags (25 pack)", 249.0),
                        new Product("Honey Natural 500ml", 549.0),
                        new Product("Pasta Whole Wheat 500g", 179.0),
                        new Product("Coffee Beans Premium 250g", 349.0),
                        new Product("Cashew Nuts 250g", 449.0),
                        new Product("Cooking Oil Refined 1L", 179.0)
                );

                productRepository.saveAll(seededProducts);

                for (Product product : productRepository.findAll()) {
                    if (inventoryRepository.findByProductId(product.getId()).isEmpty()) {
                        Inventory inventory = new Inventory();
                        inventory.setProduct(product);
                        inventory.setQuantity(100);
                        inventory.setLowStockThreshold(10);
                        inventoryRepository.save(inventory);
                    }
                }
            }
        };
    }
}
