import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './DragAndDropBoard.css';
import { Button, Modal, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { createGroup } from '@app/services/commissionGroups';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface InitialData {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
}

const initialData: InitialData = {
  columns: {
    'default-column': {
      id: 'default-column',
      title: 'Default',
      taskIds: ['default-company'], // Initially no tasks in the default column
    },
    'column-1': {
      id: 'column-1',
      title: '10 %',
      taskIds: ['company-1', 'company-2', 'company-3'],
    },
    'column-2': {
      id: 'column-2',
      title: '20 %',
      taskIds: ['company-4', 'company-5'],
    },
    'column-3': {
      id: 'column-3',
      title: '30 %',
      taskIds: ['company-6'],
    },
  },
  tasks: {
    'default-company': { id: 'default-company', content: 'company default' },
    'company-1': { id: 'company-1', content: 'company 1' },
    'company-2': { id: 'company-2', content: 'company 2' },
    'company-3': { id: 'company-3', content: 'company 3' },
    'company-4': { id: 'company-4', content: 'company 4' },
    'company-5': { id: 'company-5', content: 'company 5' },
    'company-6': { id: 'company-6', content: 'company 6' },
  },
};

const DragAndDrop = () => {
  const [data, setData] = useState(initialData);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [editedColumnId, setEditedColumnId] = useState('');
  const [editedColumnTitle, setEditedColumnTitle] = useState('');

  const onDragEnd = (result: DropResult) => {
    console.log('onDragEnd called', result);

    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back into its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    if (startColumn === endColumn) {
      // Reorder tasks within the same column
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [startColumn.id]: newColumn,
        },
      };

      setData(newData);
    } else {
      // Move task to a different column
      const newStartTaskIds = Array.from(startColumn.taskIds);
      const newEndTaskIds = Array.from(endColumn.taskIds);

      newStartTaskIds.splice(source.index, 1);
      newEndTaskIds.splice(destination.index, 0, draggableId);

      const newColumns = {
        ...data.columns,
        [startColumn.id]: {
          ...startColumn,
          taskIds: newStartTaskIds,
        },
        [endColumn.id]: {
          ...endColumn,
          taskIds: newEndTaskIds,
        },
      };

      const newData = {
        ...data,
        columns: newColumns,
      };

      // Update the state with the new data
      setData(newData);
    }
  };

  const removeTask = (companyId: string) => {
    const newData = { ...data };
    const defaultColumnId = 'default-column';

    Object.keys(newData.columns).forEach((columnId) => {
      newData.columns[columnId].taskIds = newData.columns[columnId].taskIds.filter((id) => id !== companyId);
    });

    // Move the removed task to the default column
    newData.columns[defaultColumnId].taskIds.push(companyId);

    setData(newData);
  };

  const removeColumn = (columnId: string) => {
    if (columnId === 'default-column') {
      // Prevent removing the default column
      return;
    }

    const newData = { ...data };
    const defaultColumnId = 'default-column';

    // Move tasks from the removed column to the default column
    newData.columns[columnId].taskIds.forEach((taskId) => {
      newData.columns[defaultColumnId].taskIds.push(taskId);
    });

    // Remove the column
    delete newData.columns[columnId];

    setData(newData);
  };

  const addColumn = () => {
    const newData = { ...data };
    const newColumnId = `column-${Object.keys(data.columns).length + 1}`; // Generate a new column ID
    const newTitle = newColumnTitle; // Set a default title for the new column

    newData.columns[newColumnId] = {
      id: newColumnId,
      title: newTitle,
      taskIds: [], // Initially, no tasks in the new column
    };

    setData(newData);
  };

  const openAddColumnModal = () => {
    setIsAddColumnModalOpen(true);
  };

  const closeAddColumnModal = () => {
    setIsAddColumnModalOpen(false);
    setNewColumnTitle(''); // Reset the title when the modal is closed
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() !== '') {
      addColumn();
      closeAddColumnModal();
    }
  };

  const openEditColumnModal = (columnId: string, columnTitle: string) => {
    setEditedColumnId(columnId);
    setEditedColumnTitle(columnTitle);
    setIsEditColumnModalOpen(true);
  };

  const closeEditColumnModal = () => {
    setEditedColumnId('');
    setEditedColumnTitle('');
    setIsEditColumnModalOpen(false);
  };

  const handleEditColumn = () => {
    if (editedColumnTitle.trim() !== '') {
      const newData = { ...data };
      newData.columns[editedColumnId].title = editedColumnTitle;

      setData(newData);
      closeEditColumnModal();
    }
  };

  console.log(Object.keys(data.columns));

  return (
    <div className="drag-and-drop-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="add-column-button-container">
          <Button type="primary" onClick={openAddColumnModal} className="add-column-button">
            Add Column
          </Button>
        </div>

        {Object.keys(data.columns).map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <div className="column" key={columnId}>
              <div className="column-header">
                <h2>{column.title}</h2>

                {columnId !== 'default-column' && (
                  <Button onClick={() => removeColumn(columnId)} className="remove-column-button">
                    <DeleteOutlined />
                  </Button>
                )}

                {columnId !== 'default-column' && (
                  <Button onClick={() => openEditColumnModal(columnId, column.title)} className="edit-column-button">
                    <EditOutlined />
                  </Button>
                )}
              </div>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => (
                  <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            className="task"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>{task.content}</div>

                            {columnId !== 'default-column' && (
                              <button onClick={() => removeTask(task.id)} className="remove-button">
                                Reset
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Modal
                title="Add a New Column"
                visible={isAddColumnModalOpen}
                onCancel={closeAddColumnModal}
                footer={[
                  <Button key="cancel" onClick={closeAddColumnModal}>
                    Cancel
                  </Button>,
                  <Button key="add" type="primary" onClick={handleAddColumn}>
                    Add Column
                  </Button>,
                ]}
              >
                <Input
                  placeholder="Column Title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                />
              </Modal>

              {/* Modal for editing column title */}
              <Modal
                title="Edit Column Title"
                visible={isEditColumnModalOpen}
                onCancel={closeEditColumnModal}
                footer={[
                  <Button key="cancel" onClick={closeEditColumnModal}>
                    Cancel
                  </Button>,
                  <Button key="edit" type="primary" onClick={handleEditColumn}>
                    Save Changes
                  </Button>,
                ]}
              >
                <Input
                  placeholder="Column Title"
                  value={editedColumnTitle}
                  onChange={(e) => setEditedColumnTitle(e.target.value)}
                />
              </Modal>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default DragAndDrop;
