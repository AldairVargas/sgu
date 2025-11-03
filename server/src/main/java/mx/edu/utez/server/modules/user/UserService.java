package mx.edu.utez.server.modules.user;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> findAll() { return repository.findAll(); }

    public User findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User create(User u) {
        if (repository.existsByEmail(u.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        return repository.save(u);
    }

    public User update(Long id, User u) {
        User existing = findById(id);
        existing.setFullName(u.getFullName());
        existing.setEmail(u.getEmail());
        existing.setPhone(u.getPhone());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
