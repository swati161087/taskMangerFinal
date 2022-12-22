package com.example.taskmanagerproject.tasks;

import com.example.taskmanagerproject.tasks.dtos.CreateTaskDto;
import com.example.taskmanagerproject.tasks.dtos.CreatedTaskResponseDto;
import com.example.taskmanagerproject.tasks.exceptions.TaskNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;
    @Autowired
    public TaskService(TaskRepository taskRepository,ModelMapper modelMapper) {
        this.taskRepository = taskRepository;
        this.modelMapper=modelMapper;
    }
    public CreatedTaskResponseDto createTask(CreateTaskDto createTaskDto){
        if(createTaskDto.getDueDate().before(new Date())){
            throw new IllegalArgumentException("date can not be before current data");
        }
        TaskEntity taskEntity=this.modelMapper.map(createTaskDto,TaskEntity.class);

    taskEntity.setCompleted(false);
    TaskEntity savedTask= this.taskRepository.save(taskEntity);
    return this.modelMapper.map(taskEntity,CreatedTaskResponseDto.class);
    }
    public CreatedTaskResponseDto getTaskById(Long id){
         TaskEntity taskEntity= this.taskRepository.findById(id).orElseThrow(()->new TaskNotFoundException(id));
        return this.modelMapper.map(taskEntity,CreatedTaskResponseDto.class);
    }
    public List<CreatedTaskResponseDto> getAllTasks(){
        List<CreatedTaskResponseDto> createdTaskResponseDtoList=this.taskRepository
                .findAll()
                .stream()
                .map(task->modelMapper.map(task,CreatedTaskResponseDto.class))
                .collect(Collectors.toList());
            return  createdTaskResponseDtoList;

    }
}
