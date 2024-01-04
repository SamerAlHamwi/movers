import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
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
const Notifications = lazy(() => import('@app/pages/OtherPages/NotificationsPage'));
const Terms = lazy(() => import('@app/pages/OtherPages/TermPage'));
const ContactusPage = lazy(() => import('@app/pages/OtherPages/ContactUsPage'));
const PrivacyPolicy = lazy(() => import('@app/pages/OtherPages/PrivacyPolicyPage'));
const PaymentPrivacy = lazy(() => import('@app/pages/OtherPages/PaymentPrivacyPage'));
const RolePage = lazy(() => import('@app/pages/OtherPages/RolesPage'));
const RequestPage = lazy(() => import('@app/pages/RequestsPages/RequestsPage'));
const RequestDetailPage = lazy(() => import('@app/pages/RequestsPages/RequestDetailsPage'));
const SuitableCompanyPage = lazy(() => import('@app/pages/RequestsPages/SuitableCompaniesPage'));
const OfferPage = lazy(() => import('@app/pages/RequestsPages/OffersPage'));
const OfferDetailsPage = lazy(() => import('@app/pages/RequestsPages/OfferDetailsPage'));
const AddRequestPage = lazy(() => import('@app/pages/RequestsPages/AddRequestPage'));
const EditRequestPage = lazy(() => import('@app/pages/RequestsPages/EditRequestPage'));
const CompleteDraftPage = lazy(() => import('@app/pages/RequestsPages/CompleteDraftsPage'));
const DraftPage = lazy(() => import('@app/pages/Drafts/DraftPage'));
const Companiespage = lazy(() => import('@app/pages/CompaniesPages/Companiespage'));
const CompanyDetailPage = lazy(() => import('@app/pages/CompaniesPages/CompanytDetailsPage'));
const AddCompaniesPage = lazy(() => import('@app/pages/CompaniesPages/AddCompanyPage'));
const EditCompaniesPage = lazy(() => import('@app/pages/CompaniesPages/EditCompanyPage'));
const PotentialClientsPage = lazy(() => import('@app/pages/CompaniesPages/PotentialClientsPage'));
const BranchesPage = lazy(() => import('@app/pages/CompaniesPages/BranchPage'));
const BranchDetailPage = lazy(() => import('@app/pages/CompaniesPages/BranchDetailsPage'));
const AddBranchPage = lazy(() => import('@app/pages/CompaniesPages/AddBranchPage'));
const EditBranchPage = lazy(() => import('@app/pages/CompaniesPages/EditBranchPage'));
const BrokerspPage = lazy(() => import('@app/pages/UsersPages/BrokersPage'));
const BrokersDetailsPage = lazy(() => import('@app/pages/UsersPages/BrokerDetailsPage'));
const RejectReasonsPage = lazy(() => import('@app/pages/RejectReason/RejectReasonsPage'));
const Partnerspage = lazy(() => import('@app/pages/REMPages/PartnersPage'));
const REMDetailPage = lazy(() => import('@app/pages/REMPages/REMDetailsPage'));
const AskForHelpPage = lazy(() => import('@app/pages/OtherPages/HelpRequestsPage'));
const FrequentlyQuestionPage = lazy(() => import('@app/pages/OtherPages/FrequentlyQuestionsPage'));
const ConfigurationsPage = lazy(() => import('@app/pages/OtherPages/ConfigurationsPage'));
const PointPage = lazy(() => import('@app/pages/PointsPages/PointPage'));
const ReviewDetailsPage = lazy(() => import('@app/pages/CompaniesPages/ReviewsDetailsPage'));
const CommissionGroupPage = lazy(() => import('@app/pages/CommissionGroupsPages/CommissionGroupsPage'));
const FeaturedBundlePage = lazy(() => import('@app/pages/PointsPages/FeaturedBundlesPage'));
const ApplicationsVersionPage = lazy(() => import('@app/pages/ApplicationsVersionsPages/ApplicationsVersionsPage'));
const PaymentPage = lazy(() => import('@app/pages/Payments/PaymentsPage'));
const ComparePage = lazy(() => import('@app/pages/CompaniesPages/ComparePage'));

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);
const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);
const StatisticsAdminPage = withLoading(StatisticsAdmin);
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
const PaymentPrivacyPage = withLoading(PaymentPrivacy);
const RolesPage = withLoading(RolePage);
const RequestsPage = withLoading(RequestPage);
const RequestDetailsPage = withLoading(RequestDetailPage);
const SuitableCompaniesPage = withLoading(SuitableCompanyPage);
const OffersPage = withLoading(OfferPage);
const OffersDetailsPage = withLoading(OfferDetailsPage);
const AddRequestsPage = withLoading(AddRequestPage);
const EditRequestsPage = withLoading(EditRequestPage);
const CompleteDraftsPage = withLoading(CompleteDraftPage);
const DraftsPage = withLoading(DraftPage);
const CompanyPage = withLoading(Companiespage);
const CompanyDetailsPage = withLoading(CompanyDetailPage);
const AddCompanyPage = withLoading(AddCompaniesPage);
const EditCompanyPage = withLoading(EditCompaniesPage);
const PotentialClientPage = withLoading(PotentialClientsPage);
const BranchPage = withLoading(BranchesPage);
const BranchDetailsPage = withLoading(BranchDetailPage);
const AddBranchesPage = withLoading(AddBranchPage);
const EditBranchesPage = withLoading(EditBranchPage);
const BrokerPage = withLoading(BrokerspPage);
const BrokerDetailsPage = withLoading(BrokersDetailsPage);
const RejectReasonPage = withLoading(RejectReasonsPage);
const PartnerPage = withLoading(Partnerspage);
const REMDetailsPage = withLoading(REMDetailPage);
const AskForHelpsPage = withLoading(AskForHelpPage);
const FrequentlyQuestionsPage = withLoading(FrequentlyQuestionPage);
const ConfigurationPage = withLoading(ConfigurationsPage);
const PointsPage = withLoading(PointPage);
const ReviewsDetailsPage = withLoading(ReviewDetailsPage);
const CommissionGroupsPage = withLoading(CommissionGroupPage);
const FeaturedBundlesPage = withLoading(FeaturedBundlePage);
const ApplicationsVersionsPage = withLoading(ApplicationsVersionPage);
const PaymentsPage = withLoading(PaymentPage);
const ComparisonPage = withLoading(ComparePage);

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
              userRole === 'admin' && (
                <PrivateRoute allowedRoles={[UserRole[1]]}>
                  <StatisticsAdminPage />
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

          {/* Add Requests */}
          <Route
            path=":userId/addRequest"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <AddRequestsPage />
              </PrivateRoute>
            }
          />

          {/* Complete Draft */}
          <Route
            path=":userId/drafts/:draftId/completeDraft"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <CompleteDraftsPage />
              </PrivateRoute>
            }
          />

          {/*  Drafts */}
          <Route
            path=":userId/drafts"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <DraftsPage />
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

          <Route
            path="requests/:requestId/details/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <CompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/EditRequest"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <EditRequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/suitableCompanies&Branches/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <SuitableCompaniesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/wasSent/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <SuitableCompaniesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/offers"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="requests/:requestId/details/offers/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/details/offers/:type/:offerId/details'}
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'requests/:requestId/details/:offerId/details'}
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersDetailsPage />
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
            path="companies/:companyId/EditCompany"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <EditCompanyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/offers"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/potentialClients"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <PotentialClientPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/potentialClients/:possibleClientId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <RequestDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'companies/:companyId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersDetailsPage />
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

          <Route
            path="requests/:requestId/details/:type/:companyId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <CompanyDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/details/reviewsDetails"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ReviewsDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/comparison"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ComparisonPage />
              </PrivateRoute>
            }
          />

          {/* Commission groups */}
          <Route
            path="commissionGroups"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <CommissionGroupsPage />
              </PrivateRoute>
            }
          />

          {/* Featured Bundles */}
          <Route
            path="FeaturedBundles"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <FeaturedBundlesPage />
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
            path="companies/:companyId/branches/:branchId/offers"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersPage />
              </PrivateRoute>
            }
          />

          <Route
            path={'companies/:companyId/branches/:branchId/offers/:offerId/details'}
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <OffersDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <BranchDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="companies/:companyId/branches/:branchId/details/reviewsDetails"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ReviewsDetailsPage />
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
            path="Points"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <PointsPage />
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
            path="Brokers/:brokerId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <BrokerDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details/requests/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <RequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Brokers/:brokerId/details/:codeBroker/clients/:type"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <UsersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="RejectReason"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <RejectReasonPage />
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

          <Route
            path="Partners/:partnerId/details"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <REMDetailsPage />
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
            path="Notifications"
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
            path="PaymentPrivacy"
            element={
              <PrivateRoute allowedRoles={[UserRole[1]]}>
                <PaymentPrivacyPage />
              </PrivateRoute>
            }
          />

          <Route
            path="terms"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <TermsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="askForHelp"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <AskForHelpsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="frequentlyQuestions"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <FrequentlyQuestionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="ApplicationsVersions"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ApplicationsVersionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="configurations"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <ConfigurationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="Payments"
            element={
              <PrivateRoute allowedRoles={[UserRole[1], UserRole[4]]}>
                <PaymentsPage />
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
