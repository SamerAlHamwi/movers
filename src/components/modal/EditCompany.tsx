import { useEffect, useState } from 'react';
import { Col, Modal, Row, Select, Space, Tabs, message } from 'antd';
import { Button } from '../common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input, TextArea } from '../Admin/Translations';
import { EditBlogArticleProps, EditCompanyProps } from './ModalProps';
import { P1 } from '../common/typography/P1/P1';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_FAMILY, FONT_SIZE } from '@app/styles/themes/constants';
import { LableText, Text } from '../GeneralStyles';
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

export const EditCompany: React.FC<EditCompanyProps> = ({ visible, onCancel, onEdit, Company_values, isLoading }) => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

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
  let record: services | undefined;
  const ChangeServieceHandler = (e: any) => {
    setServieceId(e);

    if ((record?.subServices ?? []).length > 0) {
      getAllSubServices(e, page, pageSize)
        .then((data) => {
          const result = data.data?.result?.items;
          setTotalCount(data.data?.result?.totalCount);
          setData(result);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        });
    }
    if ((record?.subServices ?? []).length > 0) {
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
      .then((response) => {
        const photoId = response.data.result.id;
        const refType = response.data.result.refType;
        console.log('sdfghjk', refType);
        console.log('sdfghjk', photoId);
        setFormData((prevFormData: any) => {
          console.log('Previous FormData:', prevFormData);
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
          } else if (refType === 11) {
            updatedFormData = {
              ...updatedFormData,
              additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
            };
          } else if (refType === 8) {
            updatedFormData = {
              ...updatedFormData,
              companyProfilePhotoId: photoId,
            };
          }

          console.log('Updated FormData:', updatedFormData);
          return updatedFormData;
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

  const companyInfo: CompanyModal = {
    translations: [
      {
        name: 'string',
        bio: 'string',
        language: 'en',
      },
    ],
    services: [
      {
        numberOfBranch: 0,
        services: [
          {
            serviceId: 0,
            subServiceId: 0,
            toolId: 0,
            toolRelationType: 1,
          },
        ],
      },
    ],

    regionId: Region_id,
    address: 'string',
    cityId: 0,
    companyContact: {
      dialCode: 's7',
      phoneNumber: 'string',
      emailAddress: 'string',
      webSite: 'string',
      isForBranchCompany: false,
    },
    companyBranches: [
      {
        address: 'str',
        regionId: '5',
        numberOfBranch: 0,
        companyContact: {
          dialCode: 'stri',
          phoneNumber: 'str',
          emailAddress: 'st',
          webSite: 's',
          isForBranchCompany: true,
        },
      },
    ],
    companyProfilePhotoId: 0,
    companyOwnerIdentityIds: [0],
    companyCommercialRegisterIds: [0],
    additionalAttachmentIds: [0],
    userDto: {
      dialCode: '963',
      phoneNumber: '0997829849',
      password: '865fghjk',
    },
    isActive: true,
  };

  const [formData, setFormData] = useState<CompanyModal>(companyInfo);

  const onOk = () => {
    form.submit();
  };

  const navigate = useNavigate();
  const onFinish = (values: any) => {
    const updatedFormData = {
      ...formData,
      ...values,
      isActive: true,
    };
    updatedFormData.companyOwnerIdentityIds = updatedFormData.companyOwnerIdentityIds.filter((id: any) => id !== 0);
    updatedFormData.companyCommercialRegisterIds = updatedFormData.companyCommercialRegisterIds.filter(
      (id: any) => id !== 0,
    );
    updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);
    values = Object.assign({}, values, updatedFormData);
    onEdit(values);
    navigate('/companies'); // Sending the updatedFormData when the submit button is pressed
  };
  return (
    <Modal
      style={{ marginTop: '-6rem' }}
      open={visible}
      width={isDesktop ? '500px' : isTablet ? '450px' : '415px'}
      title={
        <div style={{ fontSize: isDesktop || isTablet ? FONT_SIZE.xl : FONT_SIZE.lg }}>
          {t('companies.addCompanyModalTitle')}
        </div>
      }
      onCancel={onCancel}
      maskClosable={true}
      footer={
        <BaseForm.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <Space>
            <Button key="cancel" style={{ height: 'auto' }} type="ghost" onClick={onCancel}>
              <P1>{t('common.cancel')}</P1>
            </Button>
            <Button type="primary" style={{ height: 'auto' }} loading={isLoading} key="add" onClick={onOk}>
              <P1>{t('companies.addCompaniesModalTitle')}</P1>
            </Button>
          </Space>
        </BaseForm.Item>
      }
    >
      <BaseForm form={form} initialValues={Company_values} onFinish={onFinish} name="CompanyForm">
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
              name={['region', 'name']}
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
              name={['cityId']}
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
              name={['regionId']}
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
              <Input value={companyInfo?.companyContact?.phoneNumber} />
            </BaseForm.Item>
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

            <Text style={{ color: '#01509A', fontSize: FONT_SIZE.xl, marginBottom: '3rem' }}>
              {t('companies. Profile')}
            </Text>
            <UploadDragger
              beforeUpload={(file) => {
                const formData = new FormData();
                formData.append('RefType', '8');
                formData.append('file', file);
                uploadImage.mutate(formData);
                return false;
              }}
              accept=".jpeg, .png, .jpg ,.Pdf"
              multiple={false}
              showUploadList={false}
            >
              {attachments.length > 0 ? (
                <Space>
                  <InboxOutlined />
                  <a href={attachments[0]?.url} target="_blank" rel="noopener noreferrer">
                    {attachments[0]?.name}
                  </a>
                </Space>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                </>
              )}
            </UploadDragger>
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
              name={['userDto', 'dialCode']}
              label={<LableText>{t('companies.CompanydialCode')}</LableText>}
              style={{ marginTop: '-1rem' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Input />
            </BaseForm.Item>
            <BaseForm.Item
              name={['userDto', 'phoneNumber']}
              label={<LableText>{t('companies.PhoneNumber')}</LableText>}
              style={{ marginTop: '-1rem' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Input />
            </BaseForm.Item>
            <BaseForm.Item
              name={['userDto', 'password']}
              label={<LableText>{t('companies.password')}</LableText>}
              style={{ marginTop: '-1rem' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Input />
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
              {t('companies.Company Branches')}
            </h2>
            {branches.map((branch, index) => (
              <div key={index}>
                <h2>Company Branch {index + 1}</h2>
                <BaseForm.Item
                  label="Phone"
                  name={`branches[${index}].phone`}
                  rules={[{ required: true, message: 'Phone is required' }]}
                >
                  <Input value={branch.phone} onChange={(e) => handleBranchChange(index, 'phone', e.target.value)} />
                </BaseForm.Item>
                <BaseForm.Item
                  label="Email"
                  name={`branches[${index}].email`}
                  rules={[{ required: true, message: 'Email is required' }]}
                >
                  <Input value={branch.email} onChange={(e) => handleBranchChange(index, 'email', e.target.value)} />
                </BaseForm.Item>
                <BaseForm.Item
                  label="Region"
                  name={`branches[${index}].region`}
                  rules={[{ required: true, message: 'Region is required' }]}
                >
                  <Input value={branch.region} onChange={(e) => handleBranchChange(index, 'region', e.target.value)} />
                </BaseForm.Item>
                <BaseForm.Item
                  label="City"
                  name={`branches[${index}].city`}
                  rules={[{ required: true, message: 'City is required' }]}
                >
                  <Input value={branch.city} onChange={(e) => handleBranchChange(index, 'city', e.target.value)} />
                </BaseForm.Item>
                <BaseForm.Item
                  label="Country"
                  name={`branches[${index}].country`}
                  rules={[{ required: true, message: 'Country is required' }]}
                >
                  <Input
                    value={branch.country}
                    onChange={(e) => handleBranchChange(index, 'country', e.target.value)}
                  />
                </BaseForm.Item>
                <BaseForm.Item
                  label="Website"
                  name={`branches[${index}].website`}
                  rules={[{ required: true, message: 'Website is required' }]}
                >
                  <Input value={branch.website} />
                </BaseForm.Item>

                {/* <Button icon={<MinusOutlined />} onClick={() => removeBranch(index)}></Button> */}
                {/* <Button
                  style={{
                    position: 'relative',
                    top: '-625px',
                    marginLeft: '989px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.3s',
                    color: 'blue',
                  }}
                  icon={<MinusOutlined />}
                  onClick={() => removeBranch(index)}
                ></Button> */}
              </div>
            ))}
            {/* <Button style={{ marginBottom: '1px' }} icon={<PlusOutlined />} onClick={addBranch}></Button> */}
            {/* <Button icon={<PlusOutlined />} onClick={addBranch}></Button> */}
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
            <BaseForm.Item
              label={<LableText>{t('companies.selectService')}</LableText>}
              name={['services', 0, 'services', 0, 'serviceId']}
              style={{ marginTop: '-1rem' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select onChange={ChangeServieceHandler}>
                {Dat?.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
            </BaseForm.Item>
            <BaseForm.Item
              label={<LableText>{t('companies.selectSubService')}</LableText>}
              name={['services', 0, 'services', 0, 'subserviceId']}
              style={{ marginTop: '-1rem' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Select>
                {Datr?.map((subservices) => (
                  <Select.Option key={subservices.id} value={subservices.id}>
                    {subservices.name}
                  </Select.Option>
                ))}
              </Select>
            </BaseForm.Item>

            {/* 
            {selectedService && (
              <>
                <P1>{t('companies.selectSubService')}</P1>
                <Select placeholder={t('companies.selectSubService')} value={selectedSubService}>
                  {Dat?.map((subService) => (
                    <Option key={subService.id} value={subService.id}>
                      {subService.name}
                    </Option>
                  ))}
                </Select>
              </>
            )} */}
            {/* 
      {selectedSubService && (
        <>
          <P1>{t('companies.selectTool')}</P1>
          <Select placeholder={t('companies.selectTool')}>
            {Tool?.map((tool) => (
              <Option key={tool.id} value={tool.id}>
                {tool.name}
              </Option>
            ))}
          </Select>
        </> */}
          </TabPane>
          <TabPane
            tab={
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '20px' }}>
                <FundTwoTone style={{ fontSize: '20px' }} /> {t('companies.Attachment')}
              </span>
            }
            key="3"
          >
            <BaseForm.Item name={'companyProfile'} style={{ marginTop: '-1rem' }}>
              <Text style={{ color: '#01509A', fontSize: FONT_SIZE.md, marginBottom: '3rem', paddingTop: '17px' }}>
                {t("companies. Uploadfiles (copy of the company's ID)")}
              </Text>
              <UploadDragger
                beforeUpload={(file) => {
                  const formData = new FormData();
                  formData.append('RefType', '9');
                  formData.append('file', file);
                  uploadImage.mutate(formData);
                  return false;
                }}
                accept=".jpeg, .png, .jpg ,.Pdf"
                multiple={false}
                showUploadList={false}
              >
                {attachments.length > 0 ? (
                  <Space>
                    <InboxOutlined />
                    <a href={attachments[1]?.url} target="_blank" rel="noopener noreferrer">
                      {attachments[1]?.name}
                    </a>
                  </Space>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined /> <FilePdfTwoTone />
                    </p>
                  </>
                )}
              </UploadDragger>
            </BaseForm.Item>

            <Text style={{ color: '#01509A', fontSize: FONT_SIZE.md, marginBottom: '3rem', paddingTop: '16px' }}>
              {t('companies.Upload files (Commercial Register)')}
            </Text>
            <UploadDragger
              beforeUpload={(file) => {
                const formData = new FormData();
                formData.append('RefType', '10');
                formData.append('file', file);
                uploadImage.mutate(formData);
                return false;
              }}
              accept=".jpeg, .png, .jpg"
              multiple={false}
              showUploadList={false}
            >
              {attachments.length > 0 ? (
                <Space>
                  <InboxOutlined />
                  <a href={attachments[2]?.url} target="_blank" rel="noopener noreferrer">
                    {attachments[2]?.name}
                  </a>
                </Space>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined /> <FilePdfTwoTone />
                  </p>
                </>
              )}
            </UploadDragger>

            <Text style={{ color: '#01509A', fontSize: FONT_SIZE.md, marginBottom: '3rem', paddingTop: '16px' }}>
              {t('companies.Upload additional  files (3 maximum)')}
            </Text>
            <UploadDragger
              beforeUpload={(file) => {
                const formData = new FormData();
                formData.append('RefType', '11');
                formData.append('file', file);
                uploadImage.mutate(formData);
                return false;
              }}
              accept=".jpeg, .png, .jpg"
              multiple={false}
              showUploadList={false}
            >
              {attachments.length > 0 ? (
                <Space>
                  <InboxOutlined />
                  <a href={attachments[3]?.url} target="_blank" rel="noopener noreferrer">
                    {attachments[3]?.name}
                  </a>
                </Space>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined /> <FilePdfTwoTone />
                  </p>
                </>
              )}
            </UploadDragger>
          </TabPane>
        </Tabs>
      </BaseForm>
    </Modal>
  );
};
