import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as groupsActions,
  ApiErrorAction,
  GroupsAction,
  GroupCreateAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchGroups, createGroups } from '../../apis/groupApis';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Group Error Received: ${action.payload.error}`);
}

function* groupsUpdate(action: PayloadAction<GroupsAction>) {
  try {
    const data = yield call(fetchGroups);
    console.log(data)
    yield put(groupsActions.groupsReceived({groups: data}));
  } catch (error) {
    yield call(message.error, `Group Error Received: ${error}`);
  }
}

function* createGroup(action: PayloadAction<GroupCreateAction>){
  try {
    const name = action.payload.name
    yield call(createGroups, name);
    yield call(message.success, `${name} Group Created`);
  } catch (error) {
    yield call(message.error, `Group Create Fail: ${error}`);
  }
}

export default function* groupSagas() {
  yield all([
    yield takeEvery(groupsActions.groupsApiErrorReceived.type, apiErrorReceived),
    yield takeEvery(groupsActions.groupsUpdate.type, groupsUpdate),
    yield takeEvery(groupsActions.createGroup.type, createGroup)
  ]);
}