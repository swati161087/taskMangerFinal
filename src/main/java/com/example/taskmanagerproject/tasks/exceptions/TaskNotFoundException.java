package com.example.taskmanagerproject.tasks.exceptions;

public class TaskNotFoundException extends IllegalArgumentException{
    public TaskNotFoundException(Long id){
        super("task with id not found " +id);
    }
}
