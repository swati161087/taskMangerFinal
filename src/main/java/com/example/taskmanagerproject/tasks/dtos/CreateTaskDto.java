package com.example.taskmanagerproject.tasks.dtos;

import jakarta.annotation.Nonnull;
import lombok.Data;

import java.util.Date;
@Data
public class CreateTaskDto {
    @Nonnull
    private String title;
    private String description;
    private Date dueDate;
}
