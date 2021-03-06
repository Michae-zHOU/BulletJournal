import React, { useState, useEffect } from 'react';
import {Input, Modal, Tooltip} from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import './modals.styles.less';
import { patchNote } from '../../features/notes/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';

type NoteProps = {
  mode: string;
  note: Note;
  patchNote: (noteId: number, content: string) => void;
};

const EditNote: React.FC<NoteProps> = props => {
  const { note, patchNote, mode } = props;
  const [visible, setVisible] = useState(false);

  const [value, setValue] = useState(note.name);
  const onOk = () => {
    if (value) {
      patchNote(note.id, value);
    }
    setVisible(!visible);
  };

  useEffect(() => {
    setValue(note.name);
  }, [note]);

  const getModal = () => {
    return (
      <Modal
        title='Edit'
        okText='Confirm'
        cancelText='Cancel'
        onOk={onOk}
        visible={visible}
        onCancel={() => setVisible(!visible)}
      >
        <Input
          onClick={e => e.stopPropagation()}
          value={value}
          placeholder={note.name}
          onChange={e => {
            e.stopPropagation();
            setValue(e.target.value);
          }}
        />
      </Modal>
    );
  };

  if (mode === 'div') {
    return (
      <div
        onClick={() => setVisible(!visible)}
        className='popover-control-item'
      >
        <span>Edit</span>
        <EditTwoTone />
        {getModal()}
      </div>
    );
  }

  return (
        <>
          <Tooltip title={'Edit Note'}>
            <div>
              <EditTwoTone onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}/>
            </div>
          </Tooltip>
          {getModal()}
        </>
  );
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, { patchNote })(EditNote);
