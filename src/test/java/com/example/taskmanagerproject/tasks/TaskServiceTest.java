package com.example.taskmanagerproject.tasks;

import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class TaskServiceTest {
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;
    @Autowired
    public TaskServiceTest(TaskRepository taskRepository,ModelMapper modelMapper){
        this.taskRepository=taskRepository;
        this.modelMapper=modelMapper;
    }

    // in datajpa test we can not autowire service we can only autowire repositories
    @Test
    public void testCreateTask(){
//        TaskService taskService=new TaskService(taskRepository,modelMapper);
//        TaskEntity task=taskService.createTask("new task");
//        System.out.println(task);
    }
}
