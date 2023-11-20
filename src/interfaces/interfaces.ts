import { NumericLiteral } from 'typescript';

export type Dimension = number | string;

export type ChartData = number[];

export type xData = number[] | string[];

export type LanguageType = 'ar' | 'en';

export type ThemeType = 'light' | 'dark';

export interface ChartSeries {
  seriesName: string;
  value: number;
  data: {
    day: number;
    value: NumericLiteral;
  };
  name: string;
}

export type ChartSeriesData = ChartSeries[];

export type Severity = 'success' | 'error' | 'info' | 'warning';

export type TwoFactorAuthOption = 'email' | 'phone';

export type BlogActivationData = {
  id: number;
  isActive: boolean;
};

export type Attachment = {
  id: number;
  url: string;
};

export type GeneralParams = {
  theNumberOfCompetingFirms: number;
  theNumberOfProductsOffered: number;
  profitTaxRate: number; // 'Moderate'
  exposureInterestRate: number; // 'Moderate'
  exposureControlFactor: number; // 'Moderate'
  theLegalPeriodForCalculatingDepreciation: number;
  theEffectOfTheSharePriceOnRealizedProfit: number; // 'Moderate'
  dividendEffectOfSharePrice: number; // 'Moderate'
  reputationFactorForCurrentMarketingSpend: number; // 'Moderate'
  performanceWeightFactor?: number; // fixed
  referencePricingFactor?: number; // fixed
  demandRegressionThreshold?: number; // fixed
  expansionAndContractionFactor?: number; // fixed
  investmentEfficiencyCoefficient?: number; // fixed
};

export type InitialMode = {
  balanceOfBankAccounts: number;
  generalFixedCosts: number;
  sharePrice: number;
  productProductionCapacity_I: number;
  theSingleVariableCostOfTheProduct_I: number;
  reputationInTheProduct_I?: number;
};

export type ProductAttributes = {
  growthRateOfTotalProductDemand_I: number;
  initialAbsorptionCoefficientOfTheProduct_I: number;
  productReputationEfficiencyFactor_I: number;
  recoveryRateOfProductSurplusValue_I: number;
  theAverageElasticityOfDemandForProduct_I: number;
  volatilityRateInDemandForProduct_I: number;
};

export type Translation = {
  title?: string;
  ttile?: string;
  description?: string;
  language: LanguageType;
  name?: string;
  address?: string;
  question?: string;
  answer?: string;
};

export type subservices = {
  id: number;
  serviceId: string;
  name: string;

  attachment?: Attachment;
  translations: Translation;
};
export type translation = {
  name?: string;
  bio?: string;
  description?: string;
  language: LanguageType;
  address?: string;
};

export interface ProductInitalModeDto
  extends Pick<
      InitialMode,
      'productProductionCapacity_I' | 'theSingleVariableCostOfTheProduct_I' | 'reputationInTheProduct_I'
    >,
    ProductAttributes {}

export type CreateGameFormData = {
  gameGenralSpecifierDto: GeneralParams;
  productInitalModeDtos: ProductInitalModeDto[];
  companyInitialModeDto: Pick<InitialMode, 'balanceOfBankAccounts' | 'generalFixedCosts' | 'sharePrice'>;
  translations: Translation[];
  gameType?: number;
};

export interface CompanyProfile {
  id: number;
  url: string;
}
export interface CompanyModal {
  id?: number;
  translations: translation[];
  services: Service;
  address?: string;
  regionId?: number;
  statues?: number;
  companyContact?: CompanyContact;
  companyProfilePhotoId?: number;
  companyProfile: CompanyProfile;
  attachment?: Attachment;
  companyBranches?: CompanyBranch[];
  companyOwnerIdentityIds?: any;
  companyCommercialRegisterIds?: any;
  additionalAttachmentIds?: any;
  availableCitiesIds?: any;
  userDto?: UserDto;
  isActive: boolean;
  companyOwnerIdentity?: any;
  companyCommercialRegister?: any;
  additionalAttachment?: any;
  comment?: 'string';
  serviceType?: 1;
}

export interface Services {
  numberOfBranch: number;
  services: Service[];
}
export interface Service {
  serviceId: number;
  subServiceId: number;
  toolId: number;
}

export interface CompanyContact {
  dialCode: string;
  phoneNumber: string;
  emailAddress: string;
  webSite: string;
  isForBranchCompany: boolean;
  companyBranchId?: number;
  companyId?: number;
}

export interface CompanyBranch {
  address: string;
  regionId: string;
  numberOfBranch: number;
  companyContact: CompanyContact;
}

export interface UserDto {
  dialCode: string;
  phoneNumber: string;
  password: string;
}

export interface UserModel {
  id: number;
  userName: string;
  name: string;
  surname: string;
  fullName: string;
  emailAddress: string;
  password: string;
  userType: number;
  type: number;
  creationTime: string;
  isActive: boolean | string;
}

export interface Services {
  numberOfBranch: number;
  services: Service[];
}

export interface CompanyContact {
  dialCode: string;
  phoneNumber: string;
  emailAddress: string;
  webSite: string;
  isForBranchCompany: boolean;
  companyBranchId?: number;
  companyId?: number;
}

export interface CompanyBranch {
  address: string;
  regionId: string;
  numberOfBranch: number;
  companyContact: CompanyContact;
}

export interface UserDto {
  dialCode: string;
  phoneNumber: string;
  password: string;
}

export interface ContactUsModel {
  id: number;
  emailAddress: string;
  facebook: string;
  instgram: string;
  twitter: string;
  phoneNumber: number;
  translations: Translation[];
}

export interface ServiceModel {
  id: number;
  translations: Translation[];
  attachmentId: number;
  attachment?: any;
  serviceId?: string | undefined;
}

export interface faqModel {
  id: number;
  translations: Translation[];
}

export interface SourceTypeModel {
  id: number;
  translations: Translation[];
  iconId?: number;
  icon?: any;
  attachmentId?: number;
  attributeId?: any;
  sourceTypeIds?: any;
  attachment: any;
  name?: string;
}

export interface RoleModel {
  id: number;
  name: string;
  displayName?: string;
  normalizedName: string;
  description: string;
  grantedPermissions: string[];
}

export interface BranchModel {
  id: number;
  companyId: number;
  regionId?: number;
  region: any;
  companyContact: any;
  services: any[];
  translations: translation[];
  userDto?: UserDto;
  serviceType: number;
  availableCities: any[];
}
export interface RequestModel {
  id: number;
  name: string;
  sourceCity: any;
  destinationCity: any;
  sourceAddress: any;
  destinationAddress: any;
  serviceType: number;
  statues?: number;
  sourceType: SourceTypeModel;
  attributeForSourceTypeValues: [{ attributeForSourcType: any; attributeChoice: any }];
  requestForQuotationContacts: any;
  moveAtUtc: Date;
  arrivalAtUtc: Date;
  sourceLongitude: any;
  sourceLatitude: any;
  destinationLongitude: any;
  destinationLatitude: any;
  attachments: [];
  services: [];
  attributeChoiceAndAttachments: any[];
}

export interface CountryModel {
  id: number;
  translations: Translation[];
  dialCode: string;
  isActive?: boolean | string;
}

export interface CityModel {
  id: number;
  countryId: string | undefined;
  translations: Translation[];
  isActive?: boolean | string;
}
export interface Partner {
  id: number;
  partnerCode: string;
  partnerPhoneNumber: string;
  isActive?: boolean | string;
  discountPercentage: number;
}

export interface EmailConfig {
  message: string;
  messageForResetPassword: string;
  senderEmail: string;
  senderEnableSsl: boolean;
  senderHost: string;
  senderPassword: string;
  senderPort: number;
  senderUseDefaultCredentials: boolean;
}

export interface SmsConfig {
  smsUserName: string;
  smsPassword: string;
  serviceAccountSID: string;
}

export interface Point {
  id: number;
  numberOfPoint: number;
  price: number;
  translations: Translation[];
}

export interface RejectReason {
  id: number;
  possibilityPotentialClient: number;
  translations: Translation[];
}

export interface Code {
  rsmCode: string;
  discountPercentage: number;
  phoneNumbers: string[];
}
export interface Broker {
  id: number;
  city: any;
  mediatorCode: string;
  mediatorPhoneNumbe: string;
  isActive?: boolean | string;
  commissionPercentage: number;
  mediatorProfit: number;
}
export interface RegionModel {
  id: number;
  cityId: string | undefined;
  translations: Translation[];
  isActive?: boolean | string;
}

export interface NotModal {
  translations: Translation[];
  destination: number;
  id: number;
}

export interface BlogCardProps {
  attachments: Attachment[];
  title: string;
  creationTime: string;
  description: string;
  creatorUserName: string;
  link: string;
  className?: string;
  isActive: boolean;
  id: number;
}
