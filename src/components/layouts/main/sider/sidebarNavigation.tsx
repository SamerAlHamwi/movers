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
  SettingOutlined,
  GroupOutlined,
  AppstoreOutlined,
  StarOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  WalletOutlined,
  SafetyOutlined,
  ApartmentOutlined,
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
    title: 'sidebarNavigation.branchesWithoutCompany',
    key: 'branchesWithoutCompany',
    url: '/branchesWithoutCompany',
    icon: <ApartmentOutlined />,
  },
  {
    title: 'sidebarNavigation.Payments',
    key: 'Payments',
    url: '/Payments',
    icon: <WalletOutlined />,
  },
  {
    title: 'sidebarNavigation.CommissionGroups',
    key: 'commissionGroups',
    url: '/commissionGroups',
    icon: <AppstoreOutlined />,
  },
  {
    title: 'sidebarNavigation.Points',
    key: 'Points',
    url: '/Points',
    icon: <DollarOutlined style={{ marginBottom: '-7px' }} />,
  },
  {
    title: 'sidebarNavigation.FeaturedBundles',
    key: 'FeaturedBundles',
    url: '/FeaturedBundles',
    icon: <StarOutlined />,
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
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: 'sidebarNavigation.PaymentPrivacy',
    key: 'PaymentPrivacy',
    url: `/PaymentPrivacy`,
    icon: <SafetyOutlined />,
  },
  {
    title: 'sidebarNavigation.Terms',
    key: 'Term',
    url: `/Terms`,
    icon: <FileProtectOutlined />,
  },
  {
    title: 'sidebarNavigation.FrequentlyQuestions',
    key: 'FrequentlyQuestions',
    url: `/FrequentlyQuestions`,
    icon: <QuestionOutlined />,
  },
  {
    title: 'sidebarNavigation.ApplicationsVersions',
    key: 'ApplicationsVersions',
    url: `/ApplicationsVersions`,
    icon: <CloudUploadOutlined />,
  },
  {
    title: 'sidebarNavigation.Configurations',
    key: 'Configurations',
    url: `/Configurations`,
    icon: <SettingOutlined />,
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
