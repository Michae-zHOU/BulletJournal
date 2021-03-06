import React, {useEffect, useState} from 'react';
import {Label, stringToRGB} from '../../features/label/interface';
import {Select, Tag} from 'antd';
import {useHistory} from 'react-router-dom';
import {PlusOutlined, TagOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {addSelectedLabel, labelsUpdate} from '../../features/label/actions';
import {setNoteLabels} from '../../features/notes/actions';
import {setTaskLabels} from '../../features/tasks/actions';
import {setTransactionLabels} from '../../features/transactions/actions';
import {ProjectType} from '../../features/project/constants';

import {icons} from '../../assets/icons/index';
import {DragDropContext, Draggable, Droppable, DropResult,} from 'react-beautiful-dnd';
import {IState} from '../../store';
import {ProjectItem} from "../../features/myBuJo/interface";

type DraggableLabelsProps = {
  mode: ProjectType;
  labels: Label[];
  editable: boolean;
  labelOptions: Label[];
  itemId: number;
  addSelectedLabel: (label: Label) => void;
  setNoteLabels: (noteId: number, labels: number[]) => void;
  setTaskLabels: (taskId: number, labels: number[]) => void;
  setTransactionLabels: (transactionId: number, labels: number[]) => void;
  labelsUpdate: () => void;
};

export const getIcon = (icon: string) => {
  let res = icons.filter((item) => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

export const getItemIcon = (item: ProjectItem, defaultElem: React.ReactNode) => {
  if (item.labels && item.labels[0]) {
    const icon = item.labels[0].icon;
    return getIcon(icon);
  }

  return defaultElem;
};

const reorder = (list: number[], startIndex: number, endIndex: number) => {
  console.log(list, startIndex, endIndex);
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DraggableLabelsList: React.FC<DraggableLabelsProps> = ({
  mode,
  labels,
  editable,
  itemId,
  addSelectedLabel,
  setNoteLabels,
  setTaskLabels,
  setTransactionLabels,
  labelOptions,
  labelsUpdate,
}) => {
  // hook history in router
  const history = useHistory();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const labelsId = labels && labels.map((label) => label.id);

  const shareProjectLabelUpdate: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: setNoteLabels,
    [ProjectType.TODO]: setTaskLabels,
    [ProjectType.LEDGER]: setTransactionLabels,
  };

  const shareFunction = shareProjectLabelUpdate[mode];

  useEffect(() => {
    labelsUpdate();
  }, []);
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    console.log(label);
    addSelectedLabel(label);
    history.push('/labels/search');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    console.log(labels);
    const newLabels = reorder(
      labelsId,
      result.source.index,
      result.destination.index
    );
    console.log(newLabels);
    shareFunction(itemId, newLabels);
  };

  const handleLabelDelete = (labelId: number) => {
    const deletedLabels = labelsId.filter((id) => id !== labelId);
    shareFunction(itemId, deletedLabels);
  };

  const getListStyle = () => ({
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  });
  // when adding labels for note
  const handleSubmit = () => {
    const newLabels = [...labelsId, ...selectedLabels];
    shareFunction(itemId, newLabels);
    setShowAdd(false);
  };
  // when change in selections
  const handleChange = (newlabels: number[]) => {
    setSelectedLabels((selectedLabels) => [...selectedLabels, ...newlabels]);
  };

  return (
    <div className='note-labels'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' direction='horizontal'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle() as React.CSSProperties}
              {...provided.droppableProps}
            >
              {labels &&
                labels.map((label, index) => (
                  <Draggable
                    key={label.id}
                    draggableId={`labels-${label.id}`}
                    index={index}
                    isDragDisabled={!editable}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Tag
                          key={label.id}
                          className='labels'
                          color={stringToRGB(label.value)}
                          closable={editable}
                          onClose={() => handleLabelDelete(label.id)}
                          onClick={() => {
                            if (editable) {
                              return;
                            }
                            toLabelSearching(label);
                          }}
                          style={
                            editable
                              ? { cursor: 'grab', borderRadius: 10 }
                              : { cursor: 'pointer', borderRadius: 10 }
                          }
                        >
                          <span>
                            {getIcon(label.icon)} &nbsp;
                            {label.value}
                          </span>
                        </Tag>
                      </div>
                    )}
                  </Draggable>
                ))}
              {editable ? (
                showAdd ? (
                  <Select
                    mode='multiple'
                    style={{ height: '70%', width: 100 }}
                    value={selectedLabels}
                    size='small'
                    onBlur={handleSubmit}
                    onChange={handleChange}
                  >
                    {labelOptions &&
                      labelOptions
                        .filter((option) => !labelsId.includes(option.id))
                        .map((option) => {
                          return (
                            <Select.Option key={option.id} value={option.id}>
                              {option.value}
                            </Select.Option>
                          );
                        })}
                  </Select>
                ) : (
                  <Tag
                    className='site-tag-plus'
                    style={{ height: '70%' }}
                    onClick={() => setShowAdd(true)}
                  >
                    <PlusOutlined /> New Label
                  </Tag>
                )
              ) : (
                <React.Fragment />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  setNoteLabels,
  setTaskLabels,
  setTransactionLabels,
  addSelectedLabel,
  labelsUpdate,
})(DraggableLabelsList);
