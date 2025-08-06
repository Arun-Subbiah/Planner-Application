package com.example.taskManager;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // No code needed – Spring Boot does the work
    List<Task> findAllByOrderByDueDateAsc();
}
