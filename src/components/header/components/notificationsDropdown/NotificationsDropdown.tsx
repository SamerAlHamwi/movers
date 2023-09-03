import React, { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Badge } from '@app/components/common/Badge/Badge';
import {
  NotificationsOverlay,
  Message,
} from '@app/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { useMutation, useQuery } from 'react-query';
import {
  GetUserNotifications,
  GetNumberOfUnReadUserNotifications,
  MarkAllNoteficationAsRead,
} from '@app/services/notification/userNotifications';
import { DEFAULT_PAGE_SIZE } from '@app/constants/pagination';
import { useLanguage } from '@app/hooks/useLanguage';
import { Dates } from '@app/constants/Dates';

export const NotificationsDropdown: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Message[] | undefined>(undefined);
  const [isOpened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unReadNotificationsNumber, setUnReadNotificationsNumber] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  const userNotifications = useQuery(
    ['userNotifications', language],
    () =>
      GetUserNotifications(page, pageSize)
        .then((data) => {
          const result = data.data.result?.items;
          result?.forEach((element: Message) => {
            element.dateTime !== undefined &&
              (element.dateTime = Dates.format(element.dateTime, 'DD MMMM YYYY, h:mm a'));
          });
          setTotalCount(data.data.result.totalCount);
          setNotifications(result);
          setLoading(!data.data?.success);
        })
        .catch((error) => {
          console.log(error);
        }),
    {
      enabled: !notifications,
      keepPreviousData: true,
    },
  );

  const numberOfUnReadNotifications = useQuery(
    'GetNumberOfUnReadUserNotifications',
    () =>
      GetNumberOfUnReadUserNotifications()
        .then((data) => {
          data.data?.success && (setUnReadNotificationsNumber(data.data?.result), setLoading(!data.data?.success));
        })
        .catch((error) => {
          console.log(error);
        }),
    {
      enabled: unReadNotificationsNumber === -1,
    },
  );

  const markAllNoteficationAsRead = useMutation(() =>
    MarkAllNoteficationAsRead().catch((error) => console.log(error.error?.message || error.message)),
  );

  useEffect(() => {
    !isOpened && unReadNotificationsNumber > 0
      ? (markAllNoteficationAsRead.mutateAsync(),
        // setLoading(true),
        userNotifications.refetch(),
        numberOfUnReadNotifications.refetch())
      : '';
  }, [isOpened, unReadNotificationsNumber, userNotifications.refetch, numberOfUnReadNotifications.refetch]);

  useEffect(() => {
    setLoading(true);
    userNotifications.refetch();
  }, [language, userNotifications.refetch]);

  useEffect(() => {
    userNotifications.refetch();
  }, [page, pageSize, userNotifications.refetch]);

  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <NotificationsOverlay
          totalCount={totalCount}
          loading={loading}
          notifications={notifications}
          LoadMore={() => {
            setPage((prev) => prev + 1);
            setPageSize((prev) => prev + DEFAULT_PAGE_SIZE);
          }}
        />
      }
      onOpenChange={setOpened}
    >
      <HeaderActionWrapper>
        <Button
          style={{ paddingTop: '.4rem' }}
          type={isOpened ? 'ghost' : 'text'}
          icon={
            <Badge dot={unReadNotificationsNumber !== -1 && (unReadNotificationsNumber > 0 ? true : false)}>
              <BellOutlined />
            </Badge>
          }
        />
      </HeaderActionWrapper>
    </Dropdown>
  );
};
