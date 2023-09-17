import React, { useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CompanyModal, subservices } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';
import { UploadDragger } from '../common/Upload/Upload';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { uploadAttachment } from '@app/services/Attachment';
import {
  BankOutlined,
  ClearOutlined,
  DeleteOutlined,
  FileAddOutlined,
  InboxOutlined,
  LoadingOutlined,
  PictureOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { message, Alert, Button, Col, Input, Modal, Radio, Row, Steps, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getAllCities, getAllCountries, getAllRegions } from '@app/services/locations';
import { useAtom } from 'jotai';
import { countries } from '../Admin/Locations/Countries';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useNavigate } from 'react-router-dom';
import { cities } from '../Admin/Locations/Cities';
import { getAllServices, getAllSubServices } from '@app/services/services';
import { getAllTools } from '@app/services/tools';
import { services } from '../Admin/Services';
import { createCompany } from '@app/services/company';
import { Card } from '@app/components/common/Card/Card';
import { TextArea } from '../Admin/Translations';
import { tools } from '../Admin/Services/tools';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { RcFile, UploadFile } from 'antd/es/upload';

const { Step } = Steps;
const steps = [
  {
    title: 'Company Information',
  },
  {
    title: 'Userinformation',
  },
  {
    title: 'Services',
  },
  {
    title: 'Attachment',
  },
];
let companyInfo: any = {
  translations: [
    {
      name: 'string',
      bio: 'string',
      address: 'string',
      language: 'en',
    },
  ],
  services: [
    {
      serviceId: 0,
      subServiceId: 0,
      toolId: 0,
    },
  ],
  regionId: '0',
  companyContact: {
    dialCode: 's7',
    phoneNumber: 'string',
    emailAddress: 'string',
    webSite: 'string',
    isForBranchCompany: false,
  },
  isActive: true,
  comment: 'string',
  serviceType: 1,
  userDto: {
    dialCode: '963',
    phoneNumber: '0997829849',
    password: '865fghjk',
  },

  companyProfilePhotoId: 0,
  companyOwnerIdentityIds: [],
  companyCommercialRegisterIds: [],
  additionalAttachmentIds: [],
  availableCitiesIds: [],
};
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const AddBranch: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let record: services | undefined;

  const [attachments, setAttachments] = useState<any[]>([]);
  const [countryPage, setCountryPage] = useAtom(currentGamesPageAtom);
  const [countryPageSize, setcountryPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<cities[] | undefined>();
  const [Dat, setDat] = useState<services[] | undefined>();
  const [Datr, setDatr] = useState<subservices[] | undefined>();
  const [Datt, setDatt] = useState<tools[] | undefined>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [countryData, setCountryData] = useState<countries[]>();
  const [Contry_id, setContryId] = useState(0);
  const [City_id, setCityId] = useState(0);
  const [Region_id, setRegionId] = useState(0);
  const [tool_id, settoolId] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSucces, setUploadSucces] = useState(false);
  const [uploadSucce, setUploadSucce] = useState(false);
  const [uploadSucc, setUploadSucc] = useState(false);
  const [uploadedPhotoPR, setUploadedPhotoPR] = useState('');
  const [uploadedPhotoid, setUploadedPhotoid] = useState('');
  const [uploadedPhotoreg, setUploadedPhotoreg] = useState('');
  const [uploadedPhotoidin, setUploadedPhotoidin] = useState('');
  const [services, setServices] = useState([{ serviceId: '', subserviceId: '', toolId: '' }]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [branches, setBranches] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [valueRadio, setValueRadio] = useState(1);
  const [logo, setLogo] = useState();
  const [OwnerIdentityIds, setOwnerIdentityIds] = useState();
  const [CommercialRegisterIds, setCommercialRegisterIds] = useState();
  const [additionalAttachmentIds, setAdditionalAttachmentIds] = useState();
  const [formData, setFormData] = useState<CompanyModal>(companyInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileOwnerList, setFileOwnerList] = useState([]);
  const [imageOwnerList, setImageOwnerList] = useState([]);
  const [fileCommercialList, setFileCommercialList] = useState([]);
  const [imageCommercialList, setImageCommercialList] = useState([]);
  const [fileOtherList, setFileOtherList] = useState([]);
  const [imageOtherList, setImageOtherList] = useState([]);
  const [attachmentIds, setAttachmentIds] = useState<number[]>([]);
  const [attachmentIdsChanged, setAttachmentIdsChanged] = useState(false);

  // const [activeTab, setActiveTab] = useState('1');
  // const addBranch = () => {
  //   const newBranch = {
  //     phone: '',
  //     email: '',
  //     region: '',
  //     city: '',
  //     country: '',
  //     website: '',
  //   };
  //   setBranches([...branches, newBranch]);
  // };
  // const removeBranch = (index: number) => {
  //   const updatedBranches = [...branches];
  //   updatedBranches.splice(index, 1);
  //   setBranches(updatedBranches);
  // };
  // const handleBranchChange = (index: number, field: string, value: string) => {
  //   const updatedBranches = [...branches];
  //   updatedBranches[index][field] = value;
  //   setBranches(updatedBranches);
  // };

  const country = useQuery(
    ['Countries'],
    () =>
      getAllCountries(countryPage, countryPageSize)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setCountryData(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: countryData === undefined,
    },
  );

  const ser = useQuery(
    ['Services', page, pageSize],
    () =>
      getAllServices(page, pageSize)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setDat(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: Dat === undefined,
    },
  );

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleUploadSuccess = (photoUrl: any) => {
    setUploadSuccess(true);
    setUploadedPhotoPR(photoUrl);
  };

  const handleUploadSucces = (photoUrl: any) => {
    setUploadSucces(true);
    setUploadedPhotoid(photoUrl);
  };

  const handleUploadSucce = (photoUrl: any) => {
    setUploadSucce(true);
    setUploadedPhotoreg(photoUrl);
  };

  const handleUploadSucc = (photoUrl: any) => {
    setUploadSucc(true);
    setUploadedPhotoidin(photoUrl);
  };

  const ChangeServieceHandler = (index: any, e: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], serviceId: e };
    setServices(updatedServices);

    getAllSubServices(e, page, pageSize)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data?.result?.totalCount);
        setDatr(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });

    getAllTools('', e, page, pageSize)
      .then((data) => {
        const result = data?.data?.result?.items;
        setTotalCount(data?.data?.result?.totalCount);
        setDatt(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const ChangeSubServiceHandler = (index: number, e: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], subserviceId: e };
    setServices(updatedServices);
    getAllTools(e, e, page, pageSize)
      .then((data) => {
        const result = data?.data?.result?.items;
        setTotalCount(data?.data?.result?.totalCount);
        setDatt(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const handleSubserviceSelection = (index: number, e: any) => {
    ChangeSubServiceHandler(index, e);
    getAllTools('', e, page, pageSize)
      .then((data) => {
        const result = data?.data?.result?.items;
        setTotalCount(data?.data?.result?.totalCount);
        setDatt(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
  };

  // const ChangesubHandler = (index: any, e: any) => {
  //   settoolId(e);
  //   getAllTools('', e, page, pageSize)
  //     .then((data) => {
  //       const result = data?.data?.result?.items;
  //       setTotalCount(data?.data?.result?.totalCount);
  //       setData(result);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message || error.error?.message });
  //     });
  // };

  const ChangeCountryHandler = (e: any) => {
    setContryId(e);

    getAllCities(e, page, pageSize)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data?.result?.totalCount);
        setData(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const removeService = (index: any) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);

    getAllRegions(e, page, pageSize)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data?.result?.totalCount);
        setData(result);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      });
  };

  const isServiceSelected = (serviceId: any) => {
    return services.some((service) => service.serviceId === serviceId);
  };

  const handleFormattedValueChange = (value: string) => {
    setFormattedPhoneNumber(value);
  };

  const extractDialCodeAndPhoneNumber = (fullPhoneNumber: string) => {
    const dialCode = fullPhoneNumber?.substring(0, fullPhoneNumber.indexOf('+') + 4);
    const phoneNumber = fullPhoneNumber?.substring(dialCode.length);
    return {
      dialCode,
      phoneNumber,
    };
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // const handleChange = ({ fileList, imageList }: any) => {
  //   setFileOwnerList(fileList);
  //   setImageList(imageList);
  // };

  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((response) => {
        response.data.success &&
          (setAttachmentId(response.data.result?.id), setUrlAfterUpload(response.data.result?.url));

        const photoId = response.data.result.id;
        const refType = response.data.result.refType;
        const photoUrl = response.data.result.url;
        setFormData((prevFormData) => {
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
            console.log(photoId);
            console.log(updatedFormData);

            setOwnerIdentityIds(photoId);
            handleUploadSucces(photoUrl);
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
            setCommercialRegisterIds(photoId);
            handleUploadSucce(photoUrl);
          } else if (refType === 11) {
            updatedFormData = {
              ...updatedFormData,
              additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
            };
            setAdditionalAttachmentIds(photoId);
            handleUploadSucc(photoUrl);
          } else if (refType === 8) {
            updatedFormData = {
              ...updatedFormData,

              companyProfilePhotoId: photoId,
            };
            setLogo(photoId);
            handleUploadSuccess(photoUrl);
          }
          return updatedFormData;
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

  const addCompany = useMutation((data: CompanyModal) =>
    createCompany(data)
      .then((data: any) => {
        notificationController.success({ message: t('companies.addCompanySuccessMessage') });
        queryClient.invalidateQueries('AllCompanies');
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const onFinish = (values: any) => {
    const { dialCode: dialCodeC, phoneNumber: phoneNumberC } = extractDialCodeAndPhoneNumber(
      form.getFieldValue(['companyContact', 'phoneNumber']),
    );
    const { dialCode: dialCodeU, phoneNumber: phoneNumberU } = extractDialCodeAndPhoneNumber(
      form.getFieldValue(['userDto', 'phoneNumber']),
    );
    const updatedFormData = { ...formData };
    companyInfo = {
      ...companyInfo,
      translations: [
        {
          name: form.getFieldValue(['translations', 0, 'name']),
          bio: form.getFieldValue(['translations', 0, 'bio']),
          address: form.getFieldValue(['translations', 0, 'address']),
          language: 'ar',
        },
        {
          name: form.getFieldValue(['translations', 1, 'name']),
          bio: form.getFieldValue(['translations', 1, 'bio']),
          address: form.getFieldValue(['translations', 1, 'address']),
          language: 'en',
        },
      ],
      companyContact: {
        dialCode: '+' + dialCodeC,
        phoneNumber: phoneNumberC,
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: false,
      },
      userDto: {
        dialCode: '+' + dialCodeU,
        phoneNumber: phoneNumberU,
        password: form.getFieldValue(['userDto', 'password']),
      },
      serviceType: valueRadio,
      services: services,
      companyProfilePhotoId: logo,
      additionalAttachmentIds: updatedFormData.additionalAttachmentIds,
      companyOwnerIdentityIds: updatedFormData.companyOwnerIdentityIds,
      companyCommercialRegisterIds: updatedFormData.companyCommercialRegisterIds,
      comment: form.getFieldValue('comment'),
      regionId: Region_id,
    };
    updatedFormData.translations = companyInfo.translations;
    updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);
    updatedFormData.isActive = true;
    addCompany.mutate(companyInfo);
    navigate('/companies');
  };

  const uploadImageButton = (
    <div style={{ color: '#40aaff' }}>
      <PictureOutlined />
      <div className="ant-upload-text">Upload Image</div>
    </div>
  );

  const uploadFileButton = (
    <div style={{ color: 'rgb(14 190 21)' }}>
      <div>
        <FileAddOutlined />
      </div>
      <div className="ant-upload-text">Upload File</div>
    </div>
  );

  return (
    <Card title={t('companies.addCompany')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'end'} style={{ width: '100%' }}>
        {current > 0 && (
          <Button
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => prev()}
          >
            {t('common.Previous')}
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => next()}
          >
            <CreateButtonText>{t('common.next')}</CreateButtonText>
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            style={{
              margin: '1rem 1rem 1rem 0',
              width: 'auto',
              height: 'auto',
            }}
            htmlType="submit"
            disabled={addCompany.isLoading || uploadImage.isLoading}
            onClick={() => onFinish(form.getFieldsValue())}
          >
            {t('common.done')}
          </Button>
        )}
      </Row>
      <Steps current={current} style={{ margin: '10px 10px 30px 0', padding: '0px 40px' }}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={t(`companies.${step.title}`)}
            icon={
              index === 0 ? (
                <BankOutlined />
              ) : index === 1 ? (
                <UserAddOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : index === 3 ? (
                <PictureOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <BaseForm form={form} onFinish={onFinish} name="CompanyForm">
        {current === 0 && (
          <>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'name']}
                  label={<LableText>{t('companies.CompanyNamear')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'name']}
                  label={<LableText>{t('companies.name')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'bio']}
                  label={<LableText>{t('companies.Companybioar')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'bio']}
                  label={<LableText>{t('companies.bio')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 0, 'address']}
                  label={<LableText>{t('companies.addressA')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  name={['translations', 1, 'address']}
                  label={<LableText>{t('companies.address')}</LableText>}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input />
                </BaseForm.Item>
              </Col>
            </Row>

            <BaseForm.Item
              label={<LableText>{t('companies.Country name')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeCountryHandler}>
                {countryData?.map((country) => (
                  <Option key={country.id} value={country.id}>
                    {country?.name}
                  </Option>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name={['cityId']}
              label={<LableText>{t('companies.City name')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeCityHandler}>
                {Data?.map((city) => (
                  <Select key={city.name} value={city.id}>
                    {city?.name}
                  </Select>
                ))}
              </Select>
            </BaseForm.Item>

            <BaseForm.Item
              name={['regionId']}
              label={<LableText>{t('companies.Regionname')}</LableText>}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeRegionHandler}>
                {Data?.map((Region) => (
                  <Select key={Region?.name} value={Region?.id}>
                    {Region?.name}
                  </Select>
                ))}
              </Select>
            </BaseForm.Item>

            <h2
              style={{
                color: 'black',
                paddingTop: '7px',
                paddingBottom: '15px',
                fontSize: FONT_SIZE.xxl,
                fontWeight: 'Bold',
                margin: '3rem 5% 2rem',
              }}
            >
              {t('companies.Contact Information')}
            </h2>

            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  label={<LableText>{t('companies.CompanyEmail')}</LableText>}
                  name={['companyContact', 'emailAddress']}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input value={companyInfo?.companyContact?.emailAddress} />
                </BaseForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseForm.Item
                  label={<LableText>{t('companies.website')}</LableText>}
                  name={['companyContact', 'webSite']}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                >
                  <Input value={companyInfo?.companyContact?.webSite} />
                </BaseForm.Item>
              </Col>
            </Row>
            <Row>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <BaseButtonsForm.Item
                  key={current}
                  name={['companyContact', 'phoneNumber']}
                  // $successText={t('auth.phoneNumberVerified')}
                  label={t('common.phoneNumber')}
                  rules={[
                    { required: true, message: t('common.requiredField') },
                    () => ({
                      validator(_, value) {
                        if (!value || isValidPhoneNumber(value)) {
                          return Promise.resolve();
                        }
                        if (formattedPhoneNumber.length > 12) {
                          return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                        } else if (formattedPhoneNumber.length < 12) {
                          return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                        }
                      },
                    }),
                  ]}
                  style={{ margin: '2%', direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl' }}
                >
                  <PhoneInput key={1} onChange={handleFormattedValueChange} country={'ae'} />
                </BaseButtonsForm.Item>
              </Col>
              <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
                <UploadDragger
                  maxCount={1}
                  listType="text"
                  accept=".jpeg,.png,.jpg"
                  disabled={uploadImage.isLoading ? true : false}
                  showUploadList={false}
                  customRequest={({ file }) => {
                    const formData = new FormData();
                    formData.append('RefType', '8');
                    formData.append('File', file);
                    uploadImage.mutateAsync(formData);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {uploadImage.isLoading ? (
                      <LoadingOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    ) : urlAfterUpload ? (
                      <img
                        src={urlAfterUpload}
                        style={{ width: 'auto', height: isDesktop || isTablet ? '42px' : '35px' }}
                      />
                    ) : (
                      <InboxOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    )}
                    <p
                      style={{
                        fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                        color: 'var(--text-main-color)',
                      }}
                    >
                      {uploadImage.isLoading ? t('common.uploading') : t('common.draggerUploadDescription')}
                    </p>
                  </div>
                </UploadDragger>
              </Col>
            </Row>
          </>
        )}
        {current === 1 && (
          <>
            <h2
              style={{
                color: 'black',
                paddingTop: '7px',
                paddingBottom: '15px',
                fontSize: FONT_SIZE.xxl,
                fontWeight: 'Bold',
                margin: '3rem 5% 2rem',
              }}
            >
              {t('companies.Userinformation')}
            </h2>
            <BaseButtonsForm.Item
              key={current}
              name={['userDto', 'phoneNumber']}
              $successText={t('auth.phoneNumberVerified')}
              label={t('common.phoneNumber')}
              rules={[
                { required: true, message: t('common.requiredField') },
                () => ({
                  validator(_, value) {
                    if (!value || isValidPhoneNumber(value)) {
                      return Promise.resolve();
                    }
                    if (formattedPhoneNumber.length > 12) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                    } else if (formattedPhoneNumber.length < 12) {
                      return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                    }
                  },
                }),
              ]}
              style={
                isDesktop || isTablet
                  ? {
                      width: '50%',
                      margin: 'auto',
                      direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl',
                    }
                  : {
                      width: '80%',
                      margin: '0 10%',
                      direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl',
                    }
              }
            >
              <PhoneInput key={2} onChange={handleFormattedValueChange} country={'ae'} />
            </BaseButtonsForm.Item>

            <Auth.FormItem
              label={t('auth.password')}
              name={['userDto', 'password']}
              rules={[
                {
                  required: true,
                  message: t('common.requiredField'),
                },
              ]}
              style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
            >
              <Auth.FormInputPassword placeholder={t('auth.password')} />
            </Auth.FormItem>
          </>
        )}
        {current === 2 && (
          <>
            <BaseForm.Item key={10} name="serviceType">
              <Radio.Group
                style={{ display: 'flex', width: '100%' }}
                onChange={(event) => {
                  setValueRadio(event.target.value);
                }}
              >
                <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  Internal
                </Radio>
                <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  External
                </Radio>
                <Radio value={3} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                  Both
                </Radio>
              </Radio.Group>
            </BaseForm.Item>
            {services.map((service, index) => (
              <>
                <div key={index}>
                  <Card padding="1.25rem 1.25rem 1.25rem" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                    {index !== 0 && (
                      <Button
                        type="primary"
                        style={{
                          width: '5rem',
                          height: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'center',
                          margin: '2rem auto 0',
                          justifyContent: 'space-around',
                        }}
                        onClick={() => removeService(index)}
                      >
                        <DeleteOutlined />
                      </Button>
                    )}
                    <BaseForm.Item
                      label={<LableText>{t('companies.selectService')}</LableText>}
                      name={['services', index, 'serviceId']}
                      style={
                        isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }
                      }
                      rules={[
                        {
                          required: true,
                          message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                        },
                      ]}
                    >
                      <Select onChange={(e) => ChangeServieceHandler(index, e)}>
                        {Dat?.map((service) => (
                          <Option key={service.id} value={service.id} disabled={isServiceSelected(service.id)}>
                            {service.name}
                          </Option>
                        ))}
                      </Select>
                    </BaseForm.Item>
                    <BaseForm.Item
                      label={<LableText>{t('companies.selectSubService')}</LableText>}
                      name={['services', index, 'subserviceId']}
                      style={
                        isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }
                      }
                    >
                      <Select onChange={(e) => handleSubserviceSelection(index, e)}>
                        {Datr?.map((subservice) => (
                          <Option key={subservice.id} value={subservice.id}>
                            {subservice.name}
                          </Option>
                        ))}
                      </Select>
                    </BaseForm.Item>
                    <BaseForm.Item
                      label={<LableText>{t('companies.selectTool')}</LableText>}
                      name={['services', index, 'toolId']}
                      style={{ width: '50%', margin: 'auto' }}
                    >
                      <Select>
                        {Datt?.map((tool) => (
                          <Option key={tool.id} value={tool.id}>
                            {tool.name}
                          </Option>
                        ))}
                      </Select>
                    </BaseForm.Item>
                  </Card>
                  <Button
                    type="primary"
                    style={{
                      width: '8rem',
                      height: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      margin: '2rem auto',
                      justifyContent: 'space-around',
                    }}
                    onClick={() => setServices([...services, { serviceId: '', subserviceId: '', toolId: '' }])}
                  >
                    <PlusOutlined />
                  </Button>
                </div>
              </>
            ))}
          </>
        )}
        {current === 3 && (
          <>
            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '17px',
                textAlign: 'center',
              }}
            >
              {t("companies. Uploadfiles (copy of the company's ID)")}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-owner"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageOwnerList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '9');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageOwnerList(e.fileList)}
                  maxCount={1}
                >
                  {imageOwnerList.length >= 1 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-owner"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileOwnerList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '9');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileOwnerList(e.fileList)}
                  maxCount={1}
                >
                  {fileOwnerList.length >= 1 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>

            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '16px',
                textAlign: 'center',
              }}
            >
              {t('companies.Upload files (Commercial Register)')}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-commercial "
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageCommercialList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '10');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageCommercialList(e.fileList)}
                  maxCount={1}
                >
                  {imageCommercialList.length >= 1 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-commercial "
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileCommercialList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '10');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileCommercialList(e.fileList)}
                  maxCount={1}
                >
                  {fileCommercialList.length >= 1 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>

            <Text
              style={{
                color: '#01509A',
                fontSize: FONT_SIZE.md,
                marginBottom: '3rem',
                paddingTop: '16px',
                textAlign: 'center',
              }}
            >
              {t('companies.Upload additional  files (3 maximum)')}
            </Text>
            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Col>
                <Upload
                  key="image-other"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={imageOtherList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '11');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setImageOtherList(e.fileList)}
                  maxCount={3}
                >
                  {imageOtherList.length >= 3 ? null : uploadImageButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
              <Col>
                <Upload
                  key="file-other"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  accept=".Pdf"
                  listType="picture-card"
                  fileList={fileOtherList}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    const formData = new FormData();
                    formData.append('RefType', '11');
                    formData.append('file', file);
                    uploadImage.mutate(formData);
                    return false;
                  }}
                  onChange={(e: any) => setFileOtherList(e.fileList)}
                  maxCount={3}
                >
                  {fileOtherList.length >= 3 ? null : uploadFileButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Col>
            </Row>

            <BaseForm.Item key={88} name="comment">
              <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
            </BaseForm.Item>
          </>
        )}
      </BaseForm>
    </Card>
  );
};
