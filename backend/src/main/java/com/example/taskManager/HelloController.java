package com.example.taskManager;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }

    @GetMapping("/hello2")
    public String sayHello2() {
        return sayHello3();
    }


    public String sayHello3() {
        return "Hello from Spring Boot3!";
    }






}
