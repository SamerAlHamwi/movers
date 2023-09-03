import React, { useEffect, useState } from 'react';
import { Dates } from '@app/constants/Dates';
import { message, Tag } from 'antd';
import * as S from './BlogCard.styles';
import { BlogCardProps } from '@app/interfaces/interfaces';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Dropdown } from '../Dropdown/Dropdown';
import { BlogOverlay } from '@app/components/common/BlogCards/BlogOverlay';
import { useMutation } from 'react-query';
import {
  deleteBlog,
  updateBlog,
  switchBlogActivation,
  blog_article,
  getBlogById,
} from '@app/services/blog/blogArticles';
import { BlogActivationData } from '@app/interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import { Alert } from '../Alert/Alert';
import { useAtom } from 'jotai';
import {
  refetchOnDeleteArticleBlogAtom,
  refetchOnSwitchArticleActivationAtom,
  refetchOnUpdateArticleAtom,
} from '@app/constants/atom';
import { ActionModal } from '@app/components/modal/ActionModal';
import { useResponsive } from '@app/hooks/useResponsive';
import { Button } from '../buttons/Button/Button';
import { Panel } from '../Collapse/Collapse';

export const ArticleCard: React.FC<BlogCardProps> = ({
  attachments,
  title,
  creationTime,
  description,
  creatorUserName,
  link,
  id,
  isActive,
  className = 'article-card',
}) => {
  const { t } = useTranslation();
  const { isDesktop, isTablet } = useResponsive();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpenDeleteArticleModal, setIsOpenDeleteArticleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenUpdateBlogArticleModal, setIsOpenUpdateBlogArticleModal] = useState(false);
  const [editModalData, setEditModalData] = useState<blog_article | undefined>(undefined);
  const [, setIsDeletedArticleBlog] = useAtom(refetchOnDeleteArticleBlogAtom);
  const [, setIsSwitchArticleActivation] = useAtom(refetchOnSwitchArticleActivationAtom);
  const [, setIsUpdateArticleBlog] = useAtom(refetchOnUpdateArticleAtom);
  const [showDescription, setShowDescription] = useState(false);

  const delete_article_blog = useMutation((article_id: number) =>
    deleteBlog(article_id)
      .then((data) => {
        data.data.success &&
          (setIsDeletedArticleBlog(data.data.success),
          message.open({ content: <Alert message={t('blog.deleteMessageSuccess')} type="success" showIcon /> }));
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.message || error.error?.message} type="error" showIcon /> });
      }),
  );

  const switch_article_activation = useMutation((data: BlogActivationData) =>
    switchBlogActivation(data)
      .then((data) => {
        data.data.success &&
          (message.open({
            content: (
              <Alert
                message={
                  data.data.result.isActive ? t('blog.activateSuccessMessage') : t('blog.deactivateSuccessMessage')
                }
                type="success"
                showIcon
              />
            ),
          }),
          setIsSwitchArticleActivation(data.data.success));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
        });
      }),
  );

  const update_article_blog = useMutation((data: blog_article) =>
    updateBlog(data)
      .then((data) => {
        data.data.success &&
          (setIsUpdateArticleBlog(data.data.success),
          message.open({ content: <Alert message={t('blog.updateSuccessMessage')} type="success" showIcon /> }));
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
        });
      }),
  );

  useEffect(() => {
    setIsOpenDeleteArticleModal(delete_article_blog.isLoading);
  }, [delete_article_blog.isLoading]);

  useEffect(() => {
    setIsOpenUpdateBlogArticleModal(update_article_blog.isLoading);
  }, [update_article_blog.isLoading]);

  return (
    <>
      <S.Wrapper className={className}>
        <S.Header>
          <S.AuthorWrapper>
            <S.Author>{creatorUserName}</S.Author>
            <S.DateTime>{Dates.format(creationTime, 'L')}</S.DateTime>
          </S.AuthorWrapper>

          <Dropdown
            trigger={['click']}
            onOpenChange={setIsOpenMenu}
            overlay={
              <BlogOverlay
                onClick_delete={() => {
                  setIsOpenDeleteArticleModal(true);
                  setIsOpenMenu(false);
                }}
                onClick_switch_activation={() => {
                  switch_article_activation.mutateAsync({ id, isActive: !isActive });
                  setIsOpenMenu(false);
                }}
                onClick_edit={() => {
                  getBlogById(id)
                    .then((data) => {
                      data.data.success && setEditModalData(data.data.result);
                      setIsLoading(!data.data.success);
                    })
                    .catch((error) => {
                      message.open({
                        content: <Alert message={error.message || error.error?.message} type="error" showIcon />,
                      });
                      setIsLoading(false);
                    });
                  setIsOpenUpdateBlogArticleModal(true);
                  setIsOpenMenu(false);
                }}
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
        {attachments.length === 1 ? (
          <S.Image src={attachments[0].url} alt="article" />
        ) : (
          <>
            <S.Image src={attachments[currentImageIndex].url} alt="article" loading="lazy" />
            <RightOutlined
              onClick={() => currentImageIndex < attachments.length && setCurrentImageIndex(currentImageIndex + 1)}
            />
            <LeftOutlined onClick={() => currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1)} />
          </>
        )}
        <S.InfoWrapper>
          <S.InfoHeader>
            <S.Title>{title}</S.Title>
          </S.InfoHeader>
          {/* <S.Description>{description}</S.Description> */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <S.Link>{t('common.link')}</S.Link>
            </a>
            <Tag color={isActive ? 'success' : 'error'} style={{ borderRadius: '3px' }}>
              <p style={{ fontSize: '.7rem' }}>{isActive ? t(`common.active`) : t(`common.inactive`)}</p>
            </Tag>
          </div>

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
              <S.Description>{showDescription ? description : `${description.slice(0, 100)}`}</S.Description>
            </Panel>
          </S.Collapse>
        </S.InfoWrapper>
      </S.Wrapper>

      {isOpenDeleteArticleModal ? (
        <ActionModal
          visible={isOpenDeleteArticleModal}
          width={isDesktop || isTablet ? '450px' : '350px'}
          title={t('blog.deleteModalTitle')}
          description={t('blog.deleteModalDescription')}
          cancelText={t('common.cancel')}
          okText={t('common.delete')}
          isDanger
          onCancel={() => setIsOpenDeleteArticleModal(false)}
          onOK={() => {
            delete_article_blog.mutateAsync(id);
          }}
          isLoading={delete_article_blog.isLoading}
        />
      ) : null}
    </>
  );
};
