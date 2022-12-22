package com.example.taskmanagerproject.tasks;

import com.example.taskmanagerproject.tasks.common.ExceptionResponseDto;
import com.example.taskmanagerproject.tasks.dtos.CreateTaskDto;
import com.example.taskmanagerproject.tasks.dtos.CreatedTaskResponseDto;
import com.example.taskmanagerproject.tasks.exceptions.TaskNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/hello")
    public String  printHello(@PathVariable("taskId") String taskId){
        return "hello" + taskId;
    }
    @PostMapping("")
    public ResponseEntity<CreatedTaskResponseDto> createTask(@RequestBody CreateTaskDto createTaskDto){
        CreatedTaskResponseDto savedTaskResponseDto=this.taskService.createTask(createTaskDto);
        //TODO: remove URI hardcoding and use it from application.yaml
        return ResponseEntity.created(URI.create("/tasks/"+savedTaskResponseDto.getId())).body(savedTaskResponseDto);
    }
    @GetMapping("/{taskId}")
    public  ResponseEntity<CreatedTaskResponseDto> getTaskById(@PathVariable Long taskId){
        return ResponseEntity.ok(this.taskService.getTaskById(taskId));
    }
    @GetMapping("")
    public ResponseEntity<List<CreatedTaskResponseDto>> getAllTasks(){
        return ResponseEntity.ok(this.taskService.getAllTasks());

    }
    @ExceptionHandler({
            IllegalArgumentException.class,
            TaskNotFoundException.class
    })
    public ResponseEntity<ExceptionResponseDto> handleException(Exception e){
        if(e instanceof TaskNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ExceptionResponseDto(e.getMessage()));
        } else if (e instanceof  IllegalArgumentException) {
            return ResponseEntity.badRequest().body(new ExceptionResponseDto(e.getMessage()));
        }
        return ResponseEntity.internalServerError().body(new ExceptionResponseDto(e.getMessage()));
    }
}
