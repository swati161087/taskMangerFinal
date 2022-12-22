package com.example.taskmanagerproject.tasks.dtos;

import lombok.Data;

import java.util.Date;
@Data
public class CreatedTaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private Date dueDate;
    private boolean isCompleted;
}
