package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, TaskRepositoryCustom {
    List<Task> findTaskByProject(Project project);

    List<Task> findTasksByAssignedToAndRecurrenceRuleNotNull(String assignedTo);

    @Query("SELECT task FROM Task task WHERE task.assignedTo = :assignee AND task.startTime IS NOT NULL AND " +
            "task.reminderDateTime IS NOT NULL AND " +
            "task.startTime >= :now AND task.reminderDateTime <= :now")
    List<Task> findRemindingTasks(@Param("assignee") String assignee, @Param("now") Timestamp now);

    @Query("SELECT task FROM Task task WHERE task.assignedTo = :assignee AND task.startTime IS NOT NULL AND " +
            "((task.startTime >= :startTime AND task.startTime <= :endTime) OR " +
            "(task.endTime >= :startTime AND task.endTime <= :endTime))")
    List<Task> findTasksOfAssigneeBetween(@Param("assignee") String assignee,
                                          @Param("startTime") Timestamp startTime,
                                          @Param("endTime") Timestamp endTime);
}
