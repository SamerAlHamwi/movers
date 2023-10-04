import React from 'react';
import {
  LineChartOutlined,
  UserOutlined,
  PhoneOutlined,
  BarChartOutlined,
  PushpinOutlined,
  NotificationOutlined,
  FormOutlined,
  UnlockOutlined,
  ClearOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  UsergroupAddOutlined,
  PlusCircleOutlined,
  AuditOutlined,
  HomeOutlined,
  QuestionOutlined,
  FormatPainterOutlined,
  SoundOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

type SidebarData = {
  [key: string]: SidebarNavigationItem[];
};

const AdminSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'sidebarNavigation.Statistics',
    key: 'statistics',
    url: '/',
    icon: <LineChartOutlined />,
  },
  {
    title: 'sidebarNavigation.Users',
    key: 'userManagement',
    url: '/user-management',
    icon: <UserOutlined />,
  },
  {
    title: 'sidebarNavigation.Managers',
    key: 'managerManagement',
    url: '/manager-management',
    icon: <UserOutlined />,
  },
  {
    title: 'sidebarNavigation.Requests',
    key: 'Requests',
    url: '/requests',
    icon: <AuditOutlined />,
  },
  {
    title: 'sidebarNavigation.Companies',
    key: 'Companies',
    url: '/companies',
    icon: <BankOutlined />,
  },
  {
    title: 'sidebarNavigation.AskForHelp',
    key: 'AskForHelp',
    url: `/AskForHelp`,
    icon: <QuestionOutlined />,
  },
  {
    title: 'sidebarNavigation.Services',
    key: 'services',
    url: `/services`,
    icon: <FormatPainterOutlined />,
  },
  {
    title: 'sidebarNavigation.SourceType',
    key: 'sourceType',
    url: `/sourceType`,
    icon: <HomeOutlined />,
  },
  {
    title: 'sidebarNavigation.Locations',
    key: 'locations',
    url: `/locations/countries`,
    icon: <PushpinOutlined />,
  },
  {
    title: 'sidebarNavigation.Notifications',
    key: 'notices',
    url: `/notices`,
    icon: <SoundOutlined />,
  },
  {
    title: 'sidebarNavigation.Roles',
    key: 'roles',
    url: `/roles`,
    icon: <UnlockOutlined />,
  },
  {
    title: 'sidebarNavigation.Partners',
    key: 'Partners',
    url: `/Partners`,
    icon: <UsergroupAddOutlined />,
  },
  {
    title: 'sidebarNavigation.Brokers',
    key: 'Brokers',
    url: `/Brokers`,
    icon: <UsergroupAddOutlined />,
  },
  {
    title: 'sidebarNavigation.ContactUs',
    key: 'contactUs',
    url: `/contactUs`,
    icon: <PhoneOutlined />,
  },
  {
    title: 'sidebarNavigation.PrivacyPolicy',
    key: 'PrivacyPolicy',
    url: `/PrivacyPolicy`,
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: 'sidebarNavigation.Term',
    key: 'Term',
    url: `/Terms`,
    icon: <SafetyOutlined />,
  },
];

const ManagerSidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'sidebarNavigation.Statistics',
    key: 'statistics',
    url: '/',
    icon: <BarChartOutlined />,
  },
  {
    title: 'sidebarNavigation.',
    key: 'PrivacyPolicy',
    url: `/PrivacyPolicy`,
    icon: <FormOutlined />,
  },
  {
    title: 'sidebarNavigation.Notifications',
    key: 'notices',
    url: `/notices`,
    icon: <NotificationOutlined />,
  },
];

export const sidebarData: SidebarData = {
  admin: AdminSidebarNavigation,
  manager: ManagerSidebarNavigation,
};
