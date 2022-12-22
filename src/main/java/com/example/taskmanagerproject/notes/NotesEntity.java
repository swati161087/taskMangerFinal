package com.example.taskmanagerproject.notes;

import com.example.taskmanagerproject.tasks.TaskEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name="notes")
@Getter
@Setter
@NoArgsConstructor
public class NotesEntity {
    @Id
    private Long id;
    private String text;
    @ManyToOne
    private TaskEntity task;
}
