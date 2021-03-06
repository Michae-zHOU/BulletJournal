import React, { useState } from 'react';
import { List, Button } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import NoteEditorDrawer from '../note-editor/editor-drawer.component';

type NoteContentProps = {
  content: Content;
  noteId: number;
};

const NoteContentItem: React.FC<NoteContentProps> = ({ content, noteId }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);

  const handleDisplay = () => {
    setDisplayMore(true);
  };

  return (
    <List.Item key={content.id}>
      <List.Item.Meta avatar={content.ownerAvatar} />
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}

      <Button type="link" onClick={handleDisplay}>
        {contentText.length > 300 ? 'More' : 'Open'}
      </Button>

      <NoteEditorDrawer
        content={content}
        visible={displayMore}
        setVisible={setDisplayMore}
        noteId={noteId}
      />
    </List.Item>
  );
};

export default NoteContentItem;
