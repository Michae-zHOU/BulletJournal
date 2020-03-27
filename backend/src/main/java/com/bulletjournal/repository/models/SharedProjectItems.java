package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.ProjectType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "shared_project_items"
//        indexes = {@Index(name = "shared_project_items_task_id_index", columnList = "task")}
        )
public class SharedProjectItems extends AuditModel {

    @Id
    @GeneratedValue(generator = "shared_project_items_generator")
    @SequenceGenerator(
            name = "shared_project_items_generator",
            sequenceName = "shared_project_items_sequence",
            initialValue = 100
    )
    private Long id;

    @Column
    private String username;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "task_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "note_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Note note;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "transaction_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Transaction transaction;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
}