import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  ProjectApiErrorAction,
  UpdateProjects,
  ProjectCreateAction,
  GetProjectAction,
  UpdateSharedProjectsOrderAction,
  DeleteProjectAction,
  PatchProjectAction,
  UpdateProjectRelationsAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchProjects,
  createProject,
  getProject,
  updateSharedProjectsOrder,
  deleteProject,
  updateProject,
  updateProjectRelations
} from '../../apis/projectApis';

function* projectApiErrorAction(action: PayloadAction<ProjectApiErrorAction>) {
  yield call(message.error, `Project Error Received: ${action.payload.error}`);
}

function* projectsUpdate(action: PayloadAction<UpdateProjects>) {
  try {
    const data = yield call(fetchProjects);
    const projects = yield data.json();
    //get etag and split into 2 parts
    const etags = data.headers.get("Etag")!.split("|");
    console.log(etags);

    // console.log(data);
    yield put(
      projectActions.projectsReceived({
        owned: projects.owned,
        shared: projects.shared,
        ownedProjectsEtag: etags[0],
        sharedProjectsEtag: etags[1]
      })
    );
  } catch (error) {
    yield call(message.error, `Project Error Received: ${error}`);
  }
}

function* addProject(action: PayloadAction<ProjectCreateAction>) {
  try {
    const { description, name, projectType } = action.payload;
    const data = yield call(createProject, description, name, projectType);
    yield put(projectActions.projectReceived({ project: data }));
  } catch (error) {
    yield call(message.error, `Project Create Fail: ${error}`);
  }
}

function* updateSharedProjectOwnersOrder(
  action: PayloadAction<UpdateSharedProjectsOrderAction>
) {
  try {
    const { projectOwners } = action.payload;
    yield call(updateSharedProjectsOrder, projectOwners);
    yield call(
      message.success,
      'Successfully updated SharedProjectOwnersOrder'
    );
  } catch (error) {
    yield call(message.error, `updateSharedProjectsOrder Fail: ${error}`);
  }
}

function* getUserProject(action: PayloadAction<GetProjectAction>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(getProject, projectId);
    console.log(data);
    yield put(projectActions.projectReceived({ project: data }));
  } catch (error) {
    yield call(message.error, `Get Group Error Received: ${error}`);
  }
}

function* deleteUserProject(action: PayloadAction<DeleteProjectAction>) {
  try {
    const { projectId } = action.payload;
    yield call(deleteProject, projectId);
    yield put(projectActions.projectsUpdate);
    yield call(message.success, `Project ${projectId} deleted`);
  } catch (error) {
    yield call(message.error, `Delete project fail: ${error}`);
  }
}

function* patchProject(action: PayloadAction<PatchProjectAction>) {
  try {
    const { projectId, description, groupId, name } = action.payload;
    yield call(updateProject, projectId, description, groupId, name);
    yield put(projectActions.projectsUpdate);
    yield call(message.success, 'Successfully updated project');
  } catch (error) {
    yield call(message.error, `update Project Fail: ${error}`);
  }
}

function* putProjectRelations(
  action: PayloadAction<UpdateProjectRelationsAction>
) {
  try {
    const { projects } = action.payload;
    yield call(updateProjectRelations, projects);
    yield call(message.success, 'Successfully updated project relations');
  } catch (error) {
    yield call(message.error, `update Project relations Fail: ${error}`);
  }
}

export default function* projectSagas() {
  yield all([
    yield takeLatest(
      projectActions.projectsApiErrorReceived.type,
      projectApiErrorAction
    ),
    yield takeLatest(projectActions.projectsUpdate.type, projectsUpdate),
    yield takeLatest(projectActions.createProject.type, addProject),
    yield takeLatest(projectActions.deleteProject.type, deleteUserProject),
    yield takeLatest(projectActions.getProject.type, getUserProject),
    yield takeLatest(
      projectActions.updateSharedProjectsOrder.type,
      updateSharedProjectOwnersOrder
    ),
    yield takeLatest(projectActions.patchProject.type, patchProject),
    yield takeLatest(
      projectActions.updateProjectRelations.type,
      putProjectRelations
    )
  ]);
}
