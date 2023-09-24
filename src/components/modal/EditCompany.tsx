import { useEffect, useState } from 'react';
import { Col, Image, Modal, Row, Select, Space, Tabs, message } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input, TextArea } from '../Admin/Translations';
import { EditBlogArticleProps, EditCompanyProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { CreateButtonText, LableText, Text } from '../GeneralStyles';

// import { Steps } from './CreateSliderImage';
import { UploadDragger } from '../common/Upload/Upload';
import { uploadAttachment } from '@app/services/Attachment';
import { useMutation, useQuery } from 'react-query';
import { Alert } from '../common/Alert/Alert';
import { Spinner } from '../common/Spinner/Spinner';
// import { article_blog_category } from './CreateBlogArticle';
import { blog_article } from '@app/services/blog/blogArticles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { CompanyModal, LanguageType } from '@app/interfaces/interfaces';
// import { InfoLable } from './CreateBlogArticle';
import {
  ClearOutlined,
  FilePdfTwoTone,
  FundTwoTone,
  InboxOutlined,
  InfoCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import TabPane from 'antd/lib/tabs/TabPane';
import { getAllTools } from '@app/services/tools';
import { getAllServices, getAllSubServices } from '@app/services/services';
import { useAtom } from 'jotai';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { cities } from '../Admin/Locations/Cities';
import { services } from '../Admin/Services';
import { countries } from '../Admin/Locations/Countries';
import { notificationController } from '@app/controllers/notificationController';
import { getAllCities, getAllCountries, getAllRegions } from '@app/services/locations';
import { useNavigate } from 'react-router-dom';
import { getAllCompanies, getCompanyById } from '@app/services/company';

export const EditCompany: React.FC<EditCompanyProps> = ({ visible, onCancel, onEdit, Company_values, isLoading }) => {
  const { t } = useTranslation();
  const [companyData, setCompanyData] = useState<any | undefined>(undefined);
  const [form] = BaseForm.useForm();

  const [attachments, setAttachments] = useState<any[]>([]);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [countryPage, setCountryPage] = useAtom(currentGamesPageAtom);
  const [countryPageSize, setcountryPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<cities[] | undefined>();
  const [Dat, setDat] = useState<services[] | undefined>();
  const [Datr, setDatr] = useState<services[] | undefined>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [countryData, setCountryData] = useState<countries[]>();

  const [selectedCountry, setSelectedCountry] = useState(false);

  const [Contry_id, setContryId] = useState(0);
  const [City_id, setCityId] = useState(0);
  const [Region_id, setRegionId] = useState(0);
  const [Serviece_id, setServieceId] = useState(0);

  const [totalCount, setTotalCount] = useState<number>(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');

  const onOk = () => {
    form.submit();
    onCancel();
  };

  const { refetch, isRefetching } = useQuery(['User', page, pageSize, refetchOnAddManager], () =>
    getAllCompanies(page, pageSize)
      .then((data) => {
        const result = data.data?.result?.items;
        setTotalCount(data.data.result?.totalCount);
        setLoading(!data.data?.success);
      })
      .catch((err) => {
        setLoading(false);
        notificationController.error({ message: err?.message || err.error?.message });
      }),
  );

  // const company = useQuery(['getCompany'], () =>
  //   getCompanyById(Company_values?.id)
  //     .then((data) => {
  //       const result = data.data?.result;
  //       setCompanyData(result);
  //       setLoading(!data.data?.success);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message || error.error?.message });
  //       setLoading(false);
  //     }),
  // );

  useEffect(() => {
    const updateFormValues = async () => {
      // Check if companyData is not an empty object

      console.log('Updating form with new companyData:', companyData);
      await form.setFieldsValue(companyData);
    };

    updateFormValues();
  }, [companyData, form]);
  // console.log('ghjsdfghjkl', companyData.companyCommercialRegister[0].id);

  const addBranch = () => {
    const newBranch = {
      phone: '',
      email: '',
      region: '',
      city: '',
      country: '',
      website: '',
    };
    setBranches([...branches, newBranch]);
  };
  const removeBranch = (index: number) => {
    const updatedBranches = [...branches];
    updatedBranches.splice(index, 1);
    setBranches(updatedBranches);
  };

  const handleBranchChange = (index: number, field: string, value: string) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };
  // const City = useQuery("AllCity",   getAllCountries(countryPage, countryPageSize), {});
  // const Regin = useQuery(["AllRegin", id], () => GetAllRegin(id), {});
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

  // const serviece = useQuery(
  //   ['SubServices', selectedService, page, pageSize],
  //   () => (selectedService ? getAllSubServices(selectedService, page, pageSize) : null),
  //   {
  //     enabled: Dat !== null,
  //   },
  // );
  Alert;
  const Tool = useQuery(
    ['Tools', selectedSubService, page, pageSize],
    () => (selectedSubService ? getAllTools('', '', page, pageSize) : null),
    {
      enabled: selectedSubService !== null,
    },
  );

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

  // const city = useQuery(
  //   ['CitiesById', page, pageSize, Contry_id],
  //   () =>
  //     getAllCities(Contry_id, page, pageSize)
  //       .then((data) => {
  //         const result = data.data?.result?.items;
  //         setTotalCount(data.data?.result?.totalCount);
  //         setData(result);
  //       })
  //       .catch((error) => {
  //         notificationController.error({ message: error.message || error.error?.message });
  //       }),
  //   {
  //     enabled: Data === undefined,
  //   },
  // );
  const [services, setServices] = useState([{ name: '', subserviceId: '' }]);
  let record: services | undefined;
  const ChangeServieceHandler = (index: any, e: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], name: e };
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

    if ((record?.tools ?? []).length > 0) {
      getAllTools(e, '', page, pageSize)
        .then((data) => {
          const result = data?.data?.result?.items;
          setTotalCount(data?.data?.result?.totalCount);
          setData(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        });
    }
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
    console.log('sdfghjk', Region_id);
  };

  const ChangeCountryHandler = (e: any) => {
    setContryId(e);
    console.log('sdfghjk', Contry_id);

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
  const uploadImage = useMutation((data: FormData) =>
    uploadAttachment(data)
      .then((data) => {
        // data.data.success && (setAttachmentId(data.data.result?.id), setUrlAfterUpload(data.data.result?.url));
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );
  const uploadCompanyProfilePhoto = useMutation<void, Error, FormData>(
    'uploadCompanyProfilePhoto',
    (data: FormData) => {
      return uploadAttachment(data)
        .then((response) => {
          console.log(response);

          const photoId = response.data.result.id;
          setFormData((prevFormData) => ({
            ...prevFormData,
            companyProfilePhotoId: photoId,
          }));
        })
        .catch((error) => {
          message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
        });
    },
  );

  const uploadCompanyOwnerIdentity = useMutation<void, Error, FormData>(
    'uploadCompanyOwnerIdentity',
    (data: FormData) => {
      return uploadAttachment(data)
        .then((response) => {
          const photoId = response.data.result.id;
          setFormData((prevFormData) => ({
            ...prevFormData,
            companyOwnerIdentityIds: [...prevFormData.companyOwnerIdentityIds, photoId],
          }));
        })
        .catch((error) => {
          message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
        });
    },
  );

  const uploadCompanyCommercialRegister = useMutation<void, Error, FormData>(
    'uploadCompanyCommercialRegister',
    (data: FormData) => {
      return uploadAttachment(data)
        .then((response) => {
          const photoId = response.data.result.id;
          setFormData((prevFormData) => ({
            ...prevFormData,
            companyCommercialRegisterIds: [...prevFormData.companyCommercialRegisterIds, photoId],
          }));
        })
        .catch((error) => {
          message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
        });
    },
  );

  const uploadAdditionalAttachment = useMutation<void, Error, FormData>(
    'uploadAdditionalAttachment',
    (data: FormData) => {
      return uploadAttachment(data)
        .then((response) => {
          const photoId = response.data.result.id;
          setFormData((prevFormData) => ({
            ...prevFormData,
            additionalAttachmentIds: [...prevFormData.additionalAttachmentIds, photoId],
          }));
        })
        .catch((error) => {
          message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
        });
    },
  );

  // const uploadImage = useMutation((data: FormData) =>
  //   uploadAttachment(data)
  //     .then((response) => {
  //       const photoId = response.data.result.id;
  //       const refType = response.data.result.refType;
  //       console.log('sdfghjk', refType);
  //       console.log('sdfghjk', photoId);
  //       setFormData((prevFormData: any) => {
  //         console.log('Previous FormData:', prevFormData);
  //         let updatedFormData = { ...prevFormData };
  //         if (refType === 9) {
  //           updatedFormData = {
  //             ...updatedFormData,
  //             companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
  //           };
  //         } else if (refType === 10) {
  //           updatedFormData = {
  //             ...updatedFormData,
  //             companyCommercialRegisterids: [...updatedFormData.companyCommercialRegister, photoId],
  //           };
  //         } else if (refType === 11) {
  //           updatedFormData = {
  //             ...updatedFormData,
  //             additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
  //           };
  //         } else if (refType === 8) {
  //           updatedFormData = {
  //             ...updatedFormData,
  //             companyProfilePhotoId: photoId,
  //           };
  //         }

  //         console.log('Updated FormData:', updatedFormData);
  //         return updatedFormData;
  //       });
  //     })
  //     .catch((error) => {
  //       message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
  //     }),
  // );

  const companyInfo: any = {
    translations: [
      {
        name: 'string',
        bio: 'string',
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

    address: 'string',

    isActive: true,
  };
  console.log('zaqwsx', companyData?.companyOwnerIdentity[0].id);

  const [formData, setFormData] = useState<CompanyModal>(companyInfo);

  const navigate = useNavigate();
  const onFinish = (values: CompanyModal) => {
    const updatedFormData = {
      ...formData,
      ...values,
      isActive: true,
      companyProfilePhotoId: companyData?.companyProfile?.id,
      companyOwnerIdentityIds: [companyData?.companyOwnerIdentity[0]?.id],
      companyCommercialRegisterIds: [companyData?.companyCommercialRegister[0]?.id],
      additionalAttachmentIds: [companyData?.additionalAttachment[0]?.id],
      regionId: companyData?.region?.id,
    };

    console.log('qwertyuiop[', companyData?.companyProfile?.id);

    values = Object.assign({}, values);
    onEdit(updatedFormData);
    console.log('sdfghjdfghjk', updatedFormData);

    // Sending the updatedFormData when the submit button is pressed
  };
  // const onFinish = (info: CompanyModal) => {
  //   const updatedFormData = {
  //     ...formData,
  //     ...info,
  //     isActive: true,
  //   };
  //   info = Object.assign({}, info);
  //   onEdit(updatedFormData);
  //   navigate('/companies');
  // };
  // const onFinish = (values: any) => {
  //   // Handle form submission
  //   const updatedFormData = {
  //     ...values,
  //     isActive: true,
  //   };
  //   updatedFormData.companyOwnerIdentityIds = updatedFormData.companyOwnerIdentityIds.filter((id: any) => id !== 0);
  //   updatedFormData.companyCommercialRegisterIds = updatedFormData.companyCommercialRegisterIds.filter(
  //     (id: any) => id !== 0,
  //   );
  //   updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);
  //   values = Object.assign({}, values, updatedFormData);

  //   onEdit(updatedFormData);
  //   navigate('/companies');
  // };
  // console.log(companyData?.result);

  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('companies.editeCompanyModalTitle')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button type="ghost" style={{ height: 'auto' }} onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={loading} onClick={onOk}>
              <P1>{t('common.saveEdit')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <Spinner spinning={loading}>
        <BaseForm form={form} initialValues={companyData?.result} onFinish={onFinish} name="ComnyForm">
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: '10px',
                  }}
                >
                  <InfoCircleTwoTone style={{ fontSize: '20px' }} /> {t('companies.Company Information')}
                </span>
              }
              key="1"
            >
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
              <BaseForm.Item
                name={['address']}
                label={<LableText>{t('companies.address')}</LableText>}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>
              <BaseForm.Item
                label={<LableText>{t('companies.Country name')}</LableText>}
                name={['region', 'city', 'country', 'name']}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeCountryHandler}>
                  {countryData?.map((country) => (
                    <Select.Option key={country.id} value={country.id}>
                      {country?.name}
                    </Select.Option>
                  ))}
                </Select>
              </BaseForm.Item>
              <BaseForm.Item
                name={['region', 'city', 'name']}
                label={<LableText>{t('companies.City name')}</LableText>}
                style={{ marginTop: '-1rem' }}
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
                name={['region', 'name']}
                label={<LableText>{t('companies.Regionname')}</LableText>}
                style={{ marginTop: '-1rem' }}
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
                }}
              >
                {t('companies.Contact Information')}
              </h2>

              <BaseForm.Item
                label={<LableText>{t('companies.CompanyPhoneNumber')}</LableText>}
                name={['companyContact', 'phoneNumber']}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>
              <BaseForm.Item
                label={<LableText>{t('companies.CompanyEmail')}</LableText>}
                name={['companyContact', 'emailAddress']}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>
              <BaseForm.Item
                label={<LableText>{t('companies.website')}</LableText>}
                name={['companyContact', 'webSite']}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>

              <Text style={{ color: '#01509A', fontSize: FONT_SIZE.xl, marginBottom: '3rem' }}>
                {t('companies. Profile')}
              </Text>
              <BaseForm.Item
                rules={[{ required: true, message: t('common.requiredImage') }]}
                label={<LableText>{t('common.attachment')}</LableText>}
                style={{ marginTop: '-1rem' }}
              >
                <UploadDragger
                  maxCount={1}
                  showUploadList={false}
                  disabled={uploadCompanyProfilePhoto.isLoading ? true : false}
                  listType="text"
                  accept=".jpeg,.png,.jpg"
                  customRequest={({ file }) => {
                    const formData = new FormData();
                    formData.append('RefType', '8');
                    formData.append('File', file);
                    uploadCompanyProfilePhoto.mutateAsync(formData);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {uploadCompanyProfilePhoto.isLoading ? (
                      <LoadingOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    ) : (
                      <img
                        style={{
                          width: 'auto',
                          height: isDesktop || isTablet ? '42px' : '35px',
                          objectFit: 'contain',
                        }}
                        src={
                          urlAfterUpload !== ''
                            ? urlAfterUpload
                            : companyData !== undefined
                            ? companyData?.companyProfile !== undefined
                              ? companyData?.companyProfile?.url
                              : ''
                            : ''
                        }
                      />
                    )}
                    <p
                      style={{
                        fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                        color: 'var(--text-main-color)',
                      }}
                    >
                      {uploadCompanyProfilePhoto.isLoading
                        ? t('common.uploading')
                        : t('common.draggerUploadDescription')}
                    </p>
                  </div>
                </UploadDragger>
              </BaseForm.Item>
              <h2
                style={{
                  color: 'black',
                  paddingTop: '7px',
                  paddingBottom: '15px',
                  fontSize: FONT_SIZE.xxl,
                  fontWeight: 'Bold',
                }}
              >
                {t('companies.User information')}
              </h2>

              <BaseForm.Item
                name={['user', 'userName']}
                label={<LableText>{t('companies.PhoneNumber')}</LableText>}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>
              <BaseForm.Item
                name={['user', 'emailAddress']}
                label={<LableText>{t('companies.Email')}</LableText>}
                style={{ marginTop: '-1rem' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Input />
              </BaseForm.Item>
            </TabPane>
            <TabPane
              tab={
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    tabSize: '9px',
                    marginLeft: '15px',
                  }}
                >
                  <ClearOutlined style={{ fontSize: '20px' }} /> {t('companies.Services')}
                </span>
              }
              key="2"
            >
              {services.map((service, index) => (
                <div key={index}>
                  <BaseForm.Item
                    label={<LableText>{t('companies.selectService')}</LableText>}
                    name={['services', index, 'name']}
                    style={{ marginTop: '-1rem' }}
                  >
                    <Select onChange={(e) => ChangeServieceHandler(index, e)}>
                      {Dat?.map((service) => (
                        <Select.Option key={service.id} value={service.id}>
                          {service.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </BaseForm.Item>
                  <BaseForm.Item
                    label={<LableText>{t('companies.selectSubService')}</LableText>}
                    name={['services', index, 'subServices', index, 'name']}
                    style={{ marginTop: '-1rem' }}
                  >
                    <Select>
                      {Datr?.map((subservices) => (
                        <Select.Option key={subservices.id} value={subservices.id}>
                          {subservices.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </BaseForm.Item>
                </div>
              ))}
              <Button
                type="primary"
                style={{
                  margin: '1rem 1rem 1rem 0',
                  width: 'auto',
                  height: 'auto',
                }}
                onClick={() => setServices([...services, { name: '', subserviceId: '' }])}
              >
                {' '}
                <CreateButtonText>{t('companies.Add Service')}</CreateButtonText>
              </Button>
            </TabPane>
            <TabPane
              tab={
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '20px' }}>
                  <FundTwoTone style={{ fontSize: '20px' }} /> {t('companies.Attachment')}
                </span>
              }
              key="3"
            >
              <BaseForm.Item style={{ marginTop: '-1rem' }}>
                <Text style={{ color: '#01509A', fontSize: FONT_SIZE.md, marginBottom: '3rem', paddingTop: '17px' }}>
                  {t("companies. Uploadfiles (copy of the company's ID)")}
                </Text>
                <UploadDragger
                  maxCount={1}
                  showUploadList={false}
                  disabled={uploadCompanyOwnerIdentity.isLoading ? true : false}
                  listType="text"
                  accept=".jpeg,.png,.jpg"
                  customRequest={({ file }) => {
                    const formData = new FormData();
                    formData.append('RefType', '9');
                    formData.append('File', file);
                    uploadCompanyOwnerIdentity.mutateAsync(formData);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {uploadCompanyOwnerIdentity.isLoading ? (
                      <LoadingOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    ) : (
                      <img
                        style={{
                          width: 'auto',
                          height: isDesktop || isTablet ? '42px' : '35px',
                          objectFit: 'contain',
                        }}
                        src={
                          uploadCompanyOwnerIdentity.isLoading
                            ? urlAfterUpload
                            : companyData !== undefined &&
                              companyData.companyOwnerIdentity !== undefined &&
                              companyData.companyOwnerIdentity.length > 0
                            ? companyData.companyOwnerIdentity[companyData.companyOwnerIdentity.length - 1]?.url
                            : ''
                        }
                      />
                    )}
                    <p
                      style={{
                        fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                        color: 'var(--text-main-color)',
                      }}
                    >
                      {uploadCompanyOwnerIdentity.isLoading
                        ? t('common.uploading')
                        : t('common.draggerUploadDescription')}
                    </p>
                  </div>
                </UploadDragger>
              </BaseForm.Item>
              <BaseForm.Item
                rules={[{ required: true, message: t('common.requiredImage') }]}
                label={<LableText>{t('companies.Upload files (Commercial Register)')}</LableText>}
                style={{ marginTop: '-1rem' }}
              >
                <UploadDragger
                  maxCount={1}
                  showUploadList={false}
                  disabled={uploadCompanyCommercialRegister.isLoading ? true : false}
                  listType="text"
                  accept=".jpeg,.png,.jpg"
                  customRequest={({ file }) => {
                    const formData = new FormData();
                    formData.append('RefType', '10');
                    formData.append('File', file);
                    uploadCompanyCommercialRegister.mutateAsync(formData);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {uploadCompanyCommercialRegister.isLoading ? (
                      <LoadingOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    ) : (
                      <img
                        style={{
                          width: 'auto',
                          height: isDesktop || isTablet ? '42px' : '35px',
                          objectFit: 'contain',
                        }}
                        src={
                          uploadCompanyCommercialRegister.isLoading
                            ? urlAfterUpload
                            : companyData !== undefined &&
                              companyData.companyCommercialRegister !== undefined &&
                              companyData.companyCommercialRegister.length > 0
                            ? companyData.companyCommercialRegister[companyData.companyCommercialRegister.length - 1]
                                ?.url
                            : ''
                        }
                      />
                    )}
                    <p
                      style={{
                        fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                        color: 'var(--text-main-color)',
                      }}
                    >
                      {uploadCompanyCommercialRegister.isLoading
                        ? t('common.uploading')
                        : t('common.draggerUploadDescription')}
                    </p>
                  </div>
                </UploadDragger>
              </BaseForm.Item>

              <BaseForm.Item
                rules={[{ required: true, message: t('common.requiredImage') }]}
                label={<LableText>{t('companies.Upload additional  files (3 maximum)')}</LableText>}
                style={{ marginTop: '-1rem' }}
              >
                <UploadDragger
                  maxCount={1}
                  showUploadList={false}
                  disabled={uploadAdditionalAttachment.isLoading ? true : false}
                  listType="text"
                  accept=".jpeg,.png,.jpg"
                  customRequest={({ file }) => {
                    const formData = new FormData();
                    formData.append('RefType', '11');
                    formData.append('File', file);
                    uploadAdditionalAttachment.mutateAsync(formData);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {uploadAdditionalAttachment.isLoading ? (
                      <LoadingOutlined
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: isDesktop || isTablet ? FONT_SIZE.xxxl : FONT_SIZE.xxl,
                        }}
                      />
                    ) : (
                      <img
                        style={{
                          width: 'auto',
                          height: isDesktop || isTablet ? '42px' : '35px',
                          objectFit: 'contain',
                        }}
                        // src={
                        //   uploadAdditionalAttachment.isLoading
                        //     ? urlAfterUpload
                        //     : companyData !== undefined &&
                        //       companyData.additionalAttachment !== undefined &&
                        //       companyData.additionalAttachment.length > 0
                        //     ? companyData.additionalAttachment[companyData?.additionalAttachment.length - 1]?.url
                        //     : ''
                        // }
                        src={
                          uploadAdditionalAttachment.isLoading
                            ? urlAfterUpload
                            : companyData !== undefined &&
                              companyData.additionalAttachment !== undefined &&
                              companyData.additionalAttachment.length > 0
                            ? companyData.additionalAttachment[companyData.additionalAttachment.length - 1]?.url
                            : ''
                        }
                      />
                    )}
                    <p
                      style={{
                        fontSize: isDesktop || isTablet ? FONT_SIZE.xm : FONT_SIZE.sm,
                        color: 'var(--/text-main-color)',
                      }}
                    >
                      {uploadAdditionalAttachment.isLoading
                        ? t('common.uploading')
                        : t('common.draggerUploadDescription')}
                    </p>
                  </div>
                </UploadDragger>
              </BaseForm.Item>
            </TabPane>
          </Tabs>
        </BaseForm>
      </Spinner>
    </Modal>
  );
};
