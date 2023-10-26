import React from 'react';
import {
  LineChartOutlined,
  UserOutlined,
  PhoneOutlined,
  BarChartOutlined,
  NotificationOutlined,
  FormOutlined,
  UnlockOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  HomeOutlined,
  QuestionOutlined,
  FormatPainterOutlined,
  SoundOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  FileUnknownOutlined,
  DollarOutlined,
  StopOutlined,
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
    title: 'sidebarNavigation.Points',
    key: 'Points',
    url: '/Points',
    icon: <DollarOutlined style={{ marginBottom: '-7px' }} />,
  },
  {
    title: 'sidebarNavigation.AskForHelp',
    key: 'AskForHelp',
    url: `/AskForHelp`,
    icon: <FileUnknownOutlined />,
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
    icon: <EnvironmentOutlined />,
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
    icon: <TeamOutlined />,
  },
  {
    title: 'sidebarNavigation.Brokers',
    key: 'Brokers',
    url: `/Brokers`,
    icon: <TeamOutlined />,
  },
  {
    title: 'sidebarNavigation.RejectReason',
    key: 'RejectReason',
    url: `/RejectReason`,
    icon: <StopOutlined />,
  },
  {
    title: 'sidebarNavigation.ContactUs',
    key: 'contactUs',
    url: `/contactUs`,
    icon: <PhoneOutlined />,
  },
  {
    title: 'sidebarNavigation.Notifications',
    key: 'Notifications',
    url: `/Notifications`,
    icon: <SoundOutlined />,
  },
  {
    title: 'sidebarNavigation.PrivacyPolicy',
    key: 'PrivacyPolicy',
    url: `/PrivacyPolicy`,
    icon: <FileProtectOutlined />,
  },
  {
    title: 'sidebarNavigation.Term',
    key: 'Term',
    url: `/Terms`,
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: 'sidebarNavigation.FrequentlyQuestions',
    key: 'FrequentlyQuestions',
    url: `/FrequentlyQuestions`,
    icon: <QuestionOutlined />,
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
    key: 'Notifications',
    url: `/Notifications`,
    icon: <NotificationOutlined />,
  },
];

export const sidebarData: SidebarData = {
  admin: AdminSidebarNavigation,
  manager: ManagerSidebarNavigation,
};
