import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import LoginPage from '@app/pages/AuthPages/LoginPage';
import SecurityCodePage from '@app/pages/AuthPages/SecurityCodePage';
import NewPasswordPage from '@app/pages/AuthPages/NewPasswordPage';
import ForgotPasswordPage from '@app/pages/AuthPages/ForgotPassowordPage';
import SignUpPage from '@app/pages/AuthPages/SignUpPage';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import { PrivateRoute } from '@app/hocs/withAuthorization';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { UserRole } from '@app/constants/userRole';

const AuthLayout = lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
const ServerErrorPage = lazy(() => import('@app/pages/ErrorsPages/ServerErrorPage'));
const Error404Page = lazy(() => import('@app/pages/ErrorsPages/Error404Page'));
const Logout = lazy(() => import('./Logout'));
const StatisticsAdmin = lazy(() => import('@app/pages/StatsticsPages/StatisticsPage'));
const StatisticsManager = lazy(() => import('@app/pages/StatsticsPages/StatisticsManagerPage'));
const UserPage = lazy(() => import('@app/pages/UsersPages/UsersPage'));
const ManagerPage = lazy(() => import('@app/pages/UsersPages/ManagersPage'));
const ServicePage = lazy(() => import('@app/pages/ServicesPages/ServicesPage'));
const SubServicePage = lazy(() => import('@app/pages/ServicesPages/SubServicesPage'));
const ToolPage = lazy(() => import('@app/pages/ServicesPages/ToolsPage'));
const SourceTypePage = lazy(() => import('@app/pages/SourceTypesPages/SourceTypesPage'));
const TypeForSourcePage = lazy(() => import('@app/pages/SourceTypesPages/TypesForSourcePage'));
const ParentAttributeChoicePage = lazy(() => import('@app/pages/SourceTypesPages/ParentAttributeChoicesPage'));
const ChildAttributeChoicePage = lazy(() => import('@app/pages/SourceTypesPages/ChildAttributeChoicesPage'));
const CountryPage = lazy(() => import('@app/pages/LocationsPages/CountriesPage'));
const CityPage = lazy(() => import('@app/pages/LocationsPages/CitiesPage'));
const RegionPage = lazy(() => import('@app/pages/LocationsPages/RegionPage'));
const Notifications = lazy(() => import('@app/pages/RelatedPages/NotificationsPage'));
const Terms = lazy(() => import('@app/pages/Term&Condition/TermPage'));
const ContactusPage = lazy(() => import('@app/pages/RelatedPages/ContactUsPage'));
const PrivacyPolicy = lazy(() => import('@app/pages/RelatedPages/PrivacyPolicyPage'));
const RolePage = lazy(() => import('@app/pages/RelatedPages/RolesPage'));
const Companiespage = lazy(() => import('@app/pages/CompaniesPages/Companiespage'));
const AddCompaniesPage = lazy(() => import('@app/pages/CompaniesPages/AddCompanyPage'));
const BranchesPage = lazy(() => import('@app/pages/CompaniesPages/BranchPage'));
const RequestPage = lazy(() => import('@app/pages/Requests&Offers/RequestsPage'));
const AddRequestPage = lazy(() => import('@app/pages/Requests&Offers/AddRequestPage'));
const AddBranchPage = lazy(() => import('@app/pages/CompaniesPages/AddBranchPage'));
const EditBranchPage = lazy(() => import('@app/pages/CompaniesPages/EditBranchPage'));
const RequestDetailPage = lazy(() => import('@app/pages/Requests&Offers/RequestDetailsPage'));
const CompanyDetailPage = lazy(() => import('@app/pages/CompaniesPages/CompanytDetailsPage'));
const Brokerspage = lazy(() => import('@app/pages/UsersPages/BrokersPage'));
const Partnerspage = lazy(() => import('@app/pages/UsersPages/PartnersPage'));

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);
const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);
const StatisticsAdminPage = withLoading(StatisticsAdmin);
const StatisticsManagerPage = withLoading(StatisticsManager);
const UsersPage = withLoading(UserPage);
const ManagersPage = withLoading(ManagerPage);
const ServicesPage = withLoading(ServicePage);
const SubServicesPage = withLoading(SubServicePage);
const ToolsPage = withLoading(ToolPage);
const SourceTypesPage = withLoading(SourceTypePage);
const TypesForSourcePage = withLoading(TypeForSourcePage);
const ParentAttributeChoicesPage = withLoading(ParentAttributeChoicePage);
const ChildAttributeChoicesPage = withLoading(ChildAttributeChoicePage);
const CountriesPage = withLoading(CountryPage);
const CitiesPage = withLoading(CityPage);
const RegionsPage = withLoading(RegionPage);
const NotificationsPage = withLoading(Notifications);
const TermsPage = withLoading(Terms);
const ContactUsPage = withLoading(ContactusPage);
const PrivacyPolicyPage = withLoading(PrivacyPolicy);
const RolesPage = withLoading(RolePage);
const CompanyPage = withLoading(Companiespage);
const AddCompanyPage = withLoading(AddCompaniesPage);
const BranchPage = withLoading(BranchesPage);
const RequestsPage = withLoading(RequestPage);
const AddRequestsPage = withLoading(AddRequestPage);
const AddBranchesPage = withLoading(AddBranchPage);
const EditBranchesPage = withLoading(EditBranchPage);
const RequestDetailsPage = withLoading(RequestDetailPage);
const CompanyDetailsPage = withLoading(CompanyDetailPage);
const BrokerPage = withLoading(Brokerspage);
const PartnerPage = withLoading(Partnerspage);

export const AppRouter: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const userRole = UserRole[user?.userType];
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={protectedLayout}>
          <Route
            index
            element={
              userRole === 'admin' ? (
                <PrivateRoute allowedRoles={[UserRole[1]]}>
                  <StatisticsAdminPage />
                </PrivateRoute>
              ) : (
                <PrivateRoute allowedRoles={[UserRole[4]]}>
                  <StatisticsManagerPage />
                </PrivateRoute>
              )
            }
          />

          <Route
            path="user-management"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="manager-management"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ManagersPage />
              </PrivateRoute>
            }
          />

          {/* Requests */}
          <Route
            path="requests"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <RequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="addRequest"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <AddRequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Companies */}
          <Route
            path="companies"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <CompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="addCompany"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <AddCompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <CompanyDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Branches */}
          <Route
            path="companies/:companyId/branches"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <BranchPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/AddBranch"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <AddBranchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/EditBranch"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <EditBranchesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <BrokerPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Partners"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <PartnerPage />
              </PrivateRoute>
            }
          />

          {/* Services */}
          <Route
            path="services"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="services/:serviceId/subService"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <SubServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="services/:serviceId/tools"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ToolsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/services/:serviceId/subService/:subServiceId/tools"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ToolsPage />
              </PrivateRoute>
            }
          />

          {/* SourceType */}
          <Route
            path="sourceType"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <SourceTypesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <TypesForSourcePage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource/:attributeForSourceId/attributes"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ParentAttributeChoicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="sourceType/:sourceTypeId/attributeForSource/:attributeForSourceId/attributes/:attributeId/attributesChild"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <ChildAttributeChoicesPage />
              </PrivateRoute>
            }
          />

          {/* Locations */}
          <Route
            path="locations/countries"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <CountriesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="locations/countries/:countryId/cities"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <CitiesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="locations/countries/:countryId/cities/:cityId/regions"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <RegionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="notices"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="roles"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <RolesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="contactUs"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ContactUsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="PrivacyPolicy"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <PrivacyPolicyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Terms"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <TermsPage />
              </PrivateRoute>
            }
          />

          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
