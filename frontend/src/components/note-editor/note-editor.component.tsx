// a editor component for taking and update note
import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'react-redux';
import BraftEditor from 'braft-editor';
import { createContent } from '../../features/notes/actions';
import { Content } from '../../features/myBuJo/interface';

import axios from 'axios';

type NoteEditorProps = {
  noteId: number;
  content?: Content;
};

interface NoteEditorHandler {
  createContent: (noteId: number, text: string) => void;
  afterFinish: () => void;
}

const NoteEditor: React.FC<NoteEditorProps & NoteEditorHandler> = ({
  noteId,
  content,
  createContent,
  afterFinish,
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();
  const isEdit = !!content;
  const [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(content ? content.text : null)
  );
  const handleFormSubmit = () => {
    if (!isEdit) {
      form.validateFields().then(async (values) => {
        await createContent(noteId, values.noteContent.toRAW());
        afterFinish();
      });
    } else {
      return;
    }
  };

  const validateFile = (file: File) => {
    return file.size < 20 * 1024 * 1024; //20MB
  };

  const handleUpload = (param: any) => {
    const formdata = new FormData();
    formdata.append('file', param.file);
    const uploadConfig = {
      onUploadProgress: function (progressEvent: any) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        param.progress(percentCompleted);
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    axios
      .post('/api/uploadFile', formdata, uploadConfig)
      .then((res) => {
        console.log(res.data);
        param.success({
          url: res.data,
          meta: {
            id: 'xxx',
            title: param.file.name,
            alt: '',
            loop: true,
            autoPlay: false,
            controls: true,
            poster: 'http://xxx/xx.png',
          },
        });
      })
      .catch((err) => {
        param.error({
          msg: err.message,
        });
      });
  };

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      initialValues={{ noteContent: editorState }}
    >
      <Form.Item name="noteContent">
        <BraftEditor
          language="en"
          className="note-editor"
          value={editorState}
          media={{ uploadFn: handleUpload, validateFn: validateFile }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(null, { createContent })(NoteEditor);
