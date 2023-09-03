import { BlogCardProps } from '@app/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
import * as S from './BlogCard.styles';
import { Dates } from '@app/constants/Dates';
import { useTranslation } from 'react-i18next';
import { Alert } from '../Alert/Alert';
import { Dropdown } from '../Dropdown/Dropdown';
import { BlogOverlay } from './BlogOverlay';
import { BlogActivationData } from '@app/interfaces/interfaces';
import { message, Tag } from 'antd';
import { Button } from '../buttons/Button/Button';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useResponsive } from '@app/hooks/useResponsive';
import { useMutation } from 'react-query';
import { useAtom } from 'jotai';
import {
  refetchOnDeleteVideoBlogAtom,
  refetchOnSwitchVideoActivationAtom,
  refetchOnUpdateVideoAtom,
} from '@app/constants/atom';
import ReactPlayer from 'react-player';
import { Panel } from '../Collapse/Collapse';
// import { EditVideo } from '@app/components/modal/EditVideo';

export const VideoCard: React.FC<BlogCardProps> = ({
  attachments,
  title,
  creationTime,
  description,
  creatorUserName,
  id,
  isActive,
}) => {
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  // const [editModalData, setEditModalData] = useState<video | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenUpdateVideoModal, setIsOpenUpdateVideoModal] = useState(false);
  const [isOpenDeleteVideoModal, setIsOpenDeleteVideoModal] = useState(false);
  const [, setIsDeletedVideoBlog] = useAtom(refetchOnDeleteVideoBlogAtom);
  const [, setIsSwitchVideoActivation] = useAtom(refetchOnSwitchVideoActivationAtom);
  const [, setIsUpdateVideoBlog] = useAtom(refetchOnUpdateVideoAtom);
  const [showDescription, setShowDescription] = useState(false);

  // const delete_video_blog = useMutation((id: number) =>
  //   deleteVideo(id)
  //     .then((data) => {
  //       data.data.success &&
  //         (setIsDeletedVideoBlog(data.data.success),
  //         message.open({ content: <Alert message={t('video.createMessageSuccess')} type="success" showIcon /> }));
  //     })
  //     .catch((error) => {
  //       message.open({
  //         content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
  //       });
  //     }),
  // );

  // const switch_video_activation = useMutation((data: BlogActivationData) =>
  //   switchVideoActivation(data)
  //     .then((data) => {
  //       data.data.success &&
  //         (message.open({
  //           content: (
  //             <Alert
  //               message={
  //                 data.data.result.isActive ? t('video.activateSuccessMessage') : t('video.deactivateSuccessMessage')
  //               }
  //               type="success"
  //               showIcon
  //             />
  //           ),
  //         }),
  //         setIsSwitchVideoActivation(data.data.success));
  //     })
  //     .catch((error) => {
  //       message.open({
  //         content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
  //       });
  //     }),
  // );

  // const update_video = useMutation((data: any) =>
  //   updateVideo(data)
  //     .then((data) => {
  //       data.data.success &&
  //         (setIsUpdateVideoBlog(data.data.success),
  //         message.open({ content: <Alert message={t('video.updateSuccessMessage')} type="success" showIcon /> }));
  //     })
  //     .catch((error) => {
  //       message.open({
  //         content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
  //       });
  //     }),
  // );

  // useEffect(() => {
  //   setIsOpenDeleteVideoModal(delete_video_blog.isLoading);
  // }, [delete_video_blog.isLoading]);

  // useEffect(() => {
  //   setIsOpenUpdateVideoModal(update_video.isLoading);
  // }, [update_video.isLoading]);

  return (
    <>
      <S.Wrapper>
        <S.Header>
          <S.AuthorWrapper>
            <S.Author>{creatorUserName}</S.Author>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <S.DateTime>{Dates.format(creationTime, 'L')}</S.DateTime>
              <Tag style={{ margin: '0 .550rem', borderRadius: '3px' }} color={isActive ? 'success' : 'error'}>
                <p style={{ fontSize: '.7rem' }}>{isActive ? t(`common.active`) : t(`common.inactive`)}</p>
              </Tag>
            </div>
          </S.AuthorWrapper>

          <Dropdown
            trigger={['click']}
            onOpenChange={setIsOpenMenu}
            overlay={
              <BlogOverlay
                onClick_delete={() => {
                  setIsOpenDeleteVideoModal(true);
                  setIsOpenMenu(false);
                }}
                // onClick_switch_activation={() => {
                //   switch_video_activation.mutateAsync({ id, isActive: !isActive });
                //   setIsOpenMenu(false);
                // }}
                // onClick_edit={() => {
                //   getVideoById(id)
                //     .then((data) => {
                //       data.data.success && setEditModalData(data.data.result);
                //       setIsLoading(!data.data.success);
                //     })
                //     .catch((error) => {
                //       message.open({
                //         content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
                //       });
                //       setIsLoading(false);
                //     });

                //   setIsOpenUpdateVideoModal(true);
                //   setIsOpenMenu(false);
                // }}
                isActive={isActive}
              />
            }
          >
            <Button
              type="text"
              icon={<S.MoreOutlined rotate={isOpenMenu ? 90 : 0} />}
              noStyle
              style={{ margin: '0 -.5rem' }}
            />
          </Dropdown>
        </S.Header>
        <ReactPlayer
          url={attachments[0].url}
          controls={true}
          width="100%"
          style={{ aspectRatio: '3/2', objectFit: 'contain' }}
        />
        <S.InfoWrapper>
          <S.InfoHeader>
            <S.Title>{title}</S.Title>
          </S.InfoHeader>
          <S.Collapse
            style={{
              backgroundColor: 'inherit',
              margin: '0 -1rem',
            }}
            bordered={false}
            onChange={() => setShowDescription(!showDescription)}
          >
            <Panel
              header={
                showDescription ? (
                  <S.Description>{t('common.hideDescription')}</S.Description>
                ) : (
                  <S.Description>{t('common.showDescription')}</S.Description>
                )
              }
              key="1"
              style={{ marginBottom: '-.75rem' }}
            >
              <S.Description>{showDescription ? description : ''}</S.Description>
            </Panel>
          </S.Collapse>
        </S.InfoWrapper>
      </S.Wrapper>

      {isOpenDeleteVideoModal ? (
        <ActionModal
          visible={isOpenDeleteVideoModal}
          width={isDesktop || isTablet ? '450px' : '350px'}
          title={t('video.deleteModalTitle')}
          description={t('video.deleteModalDescription')}
          cancelText={t('common.cancel')}
          okText={t('common.delete')}
          isDanger
          onCancel={() => setIsOpenDeleteVideoModal(false)}
          // onOK={() => {
          //   delete_video_blog.mutateAsync(id);
          // }}
        />
      ) : null}

      {/* TODO */}
      {/* {isOpenUpdateVideoModal ? (
        <EditVideo
          visible={isOpenUpdateVideoModal}
          onCancel={() => setIsOpenUpdateVideoModal(false)}
          is_Loading_data={isLoading}
          id={id}
          onEdit={(data) => {
            update_video.mutateAsync(data);
          }}
          isLoading={update_video.isLoading}
          video_values={editModalData}
        />
      ) : null} */}
    </>
  );
};
