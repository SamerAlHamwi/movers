import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './DragAndDropBoard.css';
import { Button, Modal, Input, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getAllGroups, createGroup } from '@app/services/commissionGroups';
import { useQuery } from 'react-query';
import { notificationController } from '@app/controllers/notificationController';

interface Company {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  companies: any[];
  isDefault: boolean;
}

interface InitialData {
  groups: Record<string, Group>;
  companies: Record<string, Company>;
}

const DragAndDropBoard = () => {
  const [dataGroup, setDataGroup] = useState<Group[]>();
  const [dataCompany, setDataCompany] = useState<any[]>();
  const [data, setData] = useState<InitialData>({ groups: {}, companies: {} });
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [editedColumnId, setEditedColumnId] = useState('');
  const [editedColumnTitle, setEditedColumnTitle] = useState('');
  const [dataSource, setDataSource] = useState<any[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const { refetch, isRefetching } = useQuery(
    ['AllGroups'],
    () =>
      getAllGroups()
        .then((data) => {
          const result = data.data?.result?.items;
          setDataSource(result);
          setLoading(!data.data?.success);
        })
        .catch((err) => {
          setLoading(false);
          notificationController.error({ message: err?.message || err.error?.message });
        }),
    {
      enabled: dataSource === undefined,
    },
  );

  useEffect(() => {
    if (dataSource) {
      const Groups = dataSource?.map((group) => ({
        id: `${group.id}`,
        name: group.name,
        companies: group.companies.map((company: any) => company),
        isDefault: group.isDefault,
      }));

      setDataGroup(Groups);
    }
  }, [dataSource]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    console.log('onDragEnd called', result);

    // If there's no destination or the item was dropped back into its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      console.log('false');

      return;
    }

    if (!dataGroup) {
      // Handle the case where dataGroup is undefined
      console.log('falseeeee');

      return;
    }

    const startGroupIndex = dataGroup.findIndex((group) => group.id === source.droppableId);
    const endGroupIndex = dataGroup.findIndex((group) => group.id === destination.droppableId);

    const updatedDataGroup = [...dataGroup];
    const draggedCompany = updatedDataGroup[startGroupIndex]?.companies[source.index];

    if (!draggedCompany) {
      // Handle the case where draggedCompany is undefined
      return;
    }

    // Remove the company from the source group
    updatedDataGroup[startGroupIndex]?.companies.splice(source.index, 1);

    // Add the company to the destination group
    updatedDataGroup[endGroupIndex]?.companies.splice(destination.index, 0, draggedCompany);

    // Update the state with the new data
    setDataGroup(updatedDataGroup);
  };

  const removeTask = (companyId: string) => {
    console.log('nnn');

    // const newData = { ...data };
    // const defaultColumnId = 'default-group';

    // Object.keys(newData.groups).forEach((companyId) => {
    //   newData.groups[companyId].companiesIds = newData.groups[companyId].companiesIds.filter((id) => id !== companyId);
    // });

    // // Move the removed task to the default group
    // newData.groups[defaultColumnId].companiesIds.push(companyId);

    // setData(newData);
  };

  const removeGroup = (groupId: string) => {
    console.log('groupId', groupId);

    // if (groupId === 'default-group') {
    //   // Prevent removing the default group
    //   return;
    // }

    // const newData = { ...data };
    // const defaultColumnId = 'default-group';

    // // Move tasks from the removed group to the default group
    // newData.groups[groupId].companiesIds.forEach((companyId) => {
    //   newData.groups[defaultColumnId].companiesIds.push(companyId);
    // });

    // // Remove the group
    // delete newData.groups[groupId];

    // setData(newData);
  };

  // const addGroup = () => {
  //   const newData = { ...data };
  //   const newGroupId = `group-${Object.keys(data.groups).length + 1}`; // Generate a new group ID
  //   const newTitle = newColumnTitle; // Set a default name for the new group

  //   newData.groups[newGroupId] = {
  //     id: newGroupId,
  //     name: newTitle,
  //     companiesIds: [], // Initially, no tasks in the new group
  //   };

  //   setData(newData);
  // };

  // const openAddGroupModal = () => {
  //   setIsAddColumnModalOpen(true);
  // };

  // const closeAddGroupModal = () => {
  //   setIsAddColumnModalOpen(false);
  //   setNewColumnTitle(''); // Reset the name when the modal is closed
  // };

  // const handleAddColumn = () => {
  //   if (newColumnTitle.trim() !== '') {
  //     addGroup();
  //     closeAddGroupModal();
  //   }
  // };

  const openEditColumnModal = (companyId: string, companyName: string) => {
    console.log('companyId', companyId, 'companyName', companyName);

    // setEditedColumnId(companyId);
    // setEditedColumnTitle(columnTitle);
    // setIsEditColumnModalOpen(true);
  };

  // const closeEditColumnModal = () => {
  //   setEditedColumnId('');
  //   setEditedColumnTitle('');
  //   setIsEditColumnModalOpen(false);
  // };

  // const handleEditColumn = () => {
  //   if (editedColumnTitle.trim() !== '') {
  //     const newData = { ...data };
  //     newData.groups[editedColumnId].name = editedColumnTitle;

  //     setData(newData);
  //     closeEditColumnModal();
  //   }
  // };

  return (
    <div className="drag-and-drop-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="add-column-button-container">
          <Button
            type="primary"
            // onClick={openAddGroupModal}
            className="add-column-button"
          >
            Add Group
          </Button>
        </div>

        <Spin spinning={loading}>
          {dataGroup?.map((group) => {
            return (
              <div className="group" key={group.id}>
                <div className="column-header">
                  <h2>{group.name}</h2>
                  {!group.isDefault && (
                    <Button onClick={() => removeGroup(group.id)} className="remove-column-button">
                      <DeleteOutlined />
                    </Button>
                  )}

                  {!group.isDefault && (
                    <Button onClick={() => openEditColumnModal(group.id, group.name)} className="edit-column-button">
                      <EditOutlined />
                    </Button>
                  )}
                </div>

                <Droppable droppableId={group.id} key={group.id}>
                  {(provided) => (
                    <div className="company-list" ref={provided.innerRef} {...provided.droppableProps}>
                      {group.companies?.map((company, index) => (
                        <Draggable key={company.id} draggableId={company.id} index={index}>
                          {(provided) => (
                            <div
                              className="company"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div>{company.name}</div>

                              {!group.isDefault && (
                                <button onClick={() => removeTask(company.id)} className="remove-button">
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
              </div>
            );
          })}
        </Spin>
      </DragDropContext>
    </div>
  );
};

export default DragAndDropBoard;
