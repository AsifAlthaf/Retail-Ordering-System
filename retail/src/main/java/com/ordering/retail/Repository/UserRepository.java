package com.ordering.retail.Repository;

import com.ordering.retail.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
