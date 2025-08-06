package com.example.taskManager;

import java.sql.Connection;
import java.sql.DriverManager;

public class PgTest {
    public static void main(String[] args) throws Exception {
        Class.forName("org.postgresql.Driver");
        Connection conn = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/taskmanager", "springuser", "password");
        System.out.println("Connected successfully!");
        conn.close();
    }
}
