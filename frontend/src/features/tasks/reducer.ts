import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Task, ReminderSetting } from './interface';
import { History } from 'history';
import {User} from "../group/interface";
import {ProjectItemSharables, SharableLink} from "../system/interface";

export type TaskApiErrorAction = {
  error: string;
};

export type UpdateTasks = {
  projectId: number;
};

export type CreateTask = {
  projectId: number;
  name: string;
  assignedTo: string;
  reminderSetting: ReminderSetting;
  timezone: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  recurrenceRule?: string;
};

export type GetTask = {
  taskId: number;
};

export type TasksAction = {
  tasks: Array<Task>;
};

export type TaskAction = {
  task: Task;
};

export type PutTask = {
  projectId: number;
  tasks: Task[];
};

export type DeleteTask = {
  taskId: number;
};

export type MoveTask = {
  taskId: number;
  targetProject: number;
  history: History;
};

export type ShareTask = {
  targetUser?: string;
  taskId: number;
  targetGroup?: number;
  generateLink: boolean;
  ttl?: number
};

export type GetSharables = {
  taskId: number;
}

export type RevokeSharable = {
  taskId: number;
  user?: string;
  link?: string;
}

export type PatchTask = {
  taskId: number;
  timezone: string;
  name?: string;
  assignedTo?: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  reminderSetting?: ReminderSetting;
  recurrenceRule?: string;
};

export type CompleteTask = {
  taskId: number;
  dateTime?: string;
};

export type UncompleteTask = {
  taskId: number;
};

export type SetTaskLabels = {
  taskId: number;
  labels: number[];
};

export type updateVisibleAction = {
  visible: boolean;
};

export type ShareLinkAction = {
  link: string;
}

export type GetCompletedTasks = {
  projectId: number;
};

let initialState = {
  addTaskVisible: false,
  task: {} as Task,
  tasks: [] as Array<Task>,
  completedTasks: [] as Array<Task>,
  sharedUsers: [] as User[],
  sharedLinks: [] as SharableLink[],
  sharedLink: ''
};

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    tasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.tasks = tasks;
    },
    taskReceived: (state, action: PayloadAction<TaskAction>) => {
      const { task } = action.payload;
      state.task = task;
    },
    taskSharablesReceived: (state, action: PayloadAction<ProjectItemSharables>) => {
      const { users, links } = action.payload;
      state.sharedUsers = users;
      state.sharedLinks = links;
    },
    sharedLinkReceived: (state, action: PayloadAction<ShareLinkAction>) => {
      const { link } = action.payload;
      state.sharedLink = link;
    },
    UpdateAddTaskVisible: (
      state,
      action: PayloadAction<updateVisibleAction>
    ) => {
      const { visible } = action.payload;
      state.addTaskVisible = visible;
    },
    completedTasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.completedTasks = tasks;
    },
    taskApiErrorReceived: (state, action: PayloadAction<TaskApiErrorAction>) =>
      state,
    TasksUpdate: (state, action: PayloadAction<UpdateTasks>) => state,
    CompletedTasksUpdate: (state, action: PayloadAction<UpdateTasks>) => state,
    TasksCreate: (state, action: PayloadAction<CreateTask>) => state,
    TaskPut: (state, action: PayloadAction<PutTask>) => state,
    TaskGet: (state, action: PayloadAction<GetTask>) => state,
    CompletedTaskGet: (state, action: PayloadAction<GetTask>) => state,
    TaskDelete: (state, action: PayloadAction<DeleteTask>) => state,
    CompletedTaskDelete: (state, action: PayloadAction<DeleteTask>) => state,
    TaskPatch: (state, action: PayloadAction<PatchTask>) => state,
    TaskComplete: (state, action: PayloadAction<CompleteTask>) => state,
    TaskUncomplete: (state, action: PayloadAction<UncompleteTask>) => state,
    TaskSetLabels: (state, action: PayloadAction<SetTaskLabels>) => state,
    TaskMove: (state, action: PayloadAction<MoveTask>) => state,
    TaskShare: (state, action: PayloadAction<ShareTask>) => state,
    TaskSharablesGet: (state, action: PayloadAction<GetSharables>) => state,
    TaskRevokeSharable: (state, action: PayloadAction<RevokeSharable>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
