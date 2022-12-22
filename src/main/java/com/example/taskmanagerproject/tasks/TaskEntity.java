package com.example.taskmanagerproject.tasks;

import com.example.taskmanagerproject.notes.NotesEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity(name="tasks")
public class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(nullable =false)
    private String title;
    private String description;
    private boolean isCompleted;
    private Date dueDate;
    @OneToMany(mappedBy = "task",targetEntity = NotesEntity.class,cascade = CascadeType.ALL)
    private List<NotesEntity> notes;
}
