import { ModalProps as AntdModalProps } from 'antd';
// import { Sliders } from '../game-admin/SliderImage';
import {
  ServiceModel,
  UserModel,
  CountryModel,
  CityModel,
  RegionModel,
  ContactUsModel,
  CompanyModal,
  SourceTypeModel,
  Partner,
  RoleModel,
  Broker,
  RequestModel,
  BranchModel,
  faqModel,
} from '@app/interfaces/interfaces';
import { blog_article } from '@app/services/blog/blogArticles';
import { Notification } from '@app/components/Admin/Notifications';
import { PrivacyPolicy } from '../Admin/PrivacyPolicy';
import { Term } from '../Admin/Terms';

export interface ModalProps {
  visible: boolean;
  isLoading?: boolean;
  onCancel: () => void;
}

export interface CreateUserModalProps extends ModalProps {
  onCreateManager: (managerInfo: UserModel) => void;
}
export interface CreateBranchModalProps extends ModalProps {
  onCreate: (info: BranchModel) => void;
}
export interface CreatePartnerModalProps extends ModalProps {
  onCreatePartner: (PartnerInfo: Partner) => void;
}
export interface CreateRoleModalProps extends ModalProps {
  onCreate: (info: RoleModel) => void;
}

export interface CreateServiceModalProps extends ModalProps {
  onCreateService: (info: ServiceModel) => void;
}

export interface CreateFAQModalProps extends ModalProps {
  onCreateFAQ: (info: faqModel) => void;
}
export interface CreateBrokrModalProps extends ModalProps {
  onCreateBroker: (info: Broker) => void;
}

export interface CreateModalProps extends ModalProps {
  onCreate: (info: SourceTypeModel) => void;
}

export interface CreateCountryModalProps extends ModalProps {
  onCreateCountry: (countryInfo: CountryModel) => void;
}

export interface CreateCityModalProps extends ModalProps {
  onCreateCity: (cityInfo: CityModel) => void;
}

export interface CreateRegionModalProps extends ModalProps {
  onCreate: (Info: RegionModel) => void;
}

// export interface CreateSliderImageModalProps extends ModalProps {
//   onCreateSliderImage: (SliderData: CreateSlider) => void;
//   createSlider_isLoading: boolean;
// }

export interface CreateBlogArticleModalProps extends ModalProps {
  onCreateBlogArticle: (data: blog_article) => void;
  createBlog_isLoading: boolean;
}

// export interface CreateRoundModalProps extends ModalProps {
//   onCreateRoundModal: (Round: createRound) => void;
// }

export interface CreateNotificationModalProps extends ModalProps {
  onCreateNotification: (Notification: Notification) => void;
  isManager: boolean;
}
export interface CreateprivacyModalProps extends ModalProps {
  onCreateprivacy: (PrivacyPolicy: PrivacyPolicy) => void;
  isManager: boolean;
}
export interface CreateTermModalProps extends ModalProps {
  onCreateTerm: (Term: Term) => void;
  isManager: boolean;
}
export interface EditTermprops extends ModalProps {
  Term_values: Term | undefined;
  onEdit: (data: Term) => void;
}

// export interface CreateVideoModalProps extends ModalProps {
//   onCreateVideo: (Video: video) => void;
//   createVideo_isLoading: boolean;
// }

export interface EditManagerProps extends ModalProps {
  manager_values: UserModel | undefined;
  onEdit: (data: UserModel) => void;
}

export interface EditServiceProps extends ModalProps {
  values: ServiceModel | undefined;
  onEdit: (data: ServiceModel) => void;
  AttachmentId: number;
}

export interface EditFAQProps extends ModalProps {
  values: faqModel | undefined;
  onEdit: (data: faqModel) => void;
}
export interface EditPartnerProps extends ModalProps {
  Partner_values: Partner | undefined;
  onEdit: (data: Partner) => void;
}
export interface EditBrokerProps extends ModalProps {
  Brokr_values: Broker | undefined;
  onEdit: (data: Broker) => void;
}
export interface EditProps extends ModalProps {
  values: SourceTypeModel | undefined;
  onEdit: (data: SourceTypeModel) => void;
  iconId: number;
}

export interface EditCountryProps extends ModalProps {
  country_values: CountryModel | undefined;
  onEdit: (data: CountryModel) => void;
}
export interface EditCityProps extends ModalProps {
  city_values: CityModel | undefined;
  onEdit: (data: CityModel) => void;
}

export interface EditRegionProps extends ModalProps {
  values: RegionModel | undefined;
  onEdit: (data: RegionModel) => void;
}
export interface EditRoleProps extends ModalProps {
  values: RoleModel | undefined;
  onEdit: (data: RoleModel) => void;
}
export interface EditRequestProps extends ModalProps {
  values: RequestModel | undefined;
  onEdit: (data: RequestModel) => void;
}
export interface EditContactProps extends ModalProps {
  contact_values: ContactUsModel | undefined;
  onEdit: (data: ContactUsModel) => void;
}
export interface EditNotifactionprops extends ModalProps {
  Not_values: Notification | undefined;
  onEdit: (data: Notification) => void;
}
export interface Editprivacyprops extends ModalProps {
  Priv_values: PrivacyPolicy | undefined;
  onEdit: (data: PrivacyPolicy) => void;
}

export interface EditBlogArticleProps extends ModalProps {
  blogArticle_values: blog_article | undefined;
  onEdit: (data: blog_article) => void;
  id: number;
  attachment_id: number;
  is_Loading_data: boolean;
}

export interface EditCompanyProps extends ModalProps {
  Company_values: CompanyModal | undefined;
  onEdit: (data: CompanyModal) => void;
}

// export interface EditVideoProps extends ModalProps {
//   video_values: video | undefined;
//   onEdit: (data: video) => void;
//   id: number;
//   is_Loading_data: boolean;
// }

export interface ActionModalProps extends AntdModalProps {
  visible: boolean;
  onCancel?: () => void;
  onOK?: (id: any) => void;
  title?: string;
  okText?: string;
  cancelText?: string;
  description?: string;
  okButtonType?: 'default' | 'link' | 'text' | 'ghost' | 'primary' | 'dashed' | undefined;
  isDanger?: boolean;
  isLoading?: boolean;
  element?: React.ReactNode;
  isHiddenOkButton?: boolean;
  isHiddenCancelButton?: boolean;
  ModalSize?: 'small' | 'medium' | 'large';
  onHideFooter?: boolean;
}
