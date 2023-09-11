import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

import { P1 } from '../common/typography/P1/P1';
import { InputPassword } from '../common/inputs/InputPassword/InputPassword.styles';
import { CreateButtonText, LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { CompanyModal, Service, subservices } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { Text } from '../GeneralStyles';
import { UploadDragger } from '../common/Upload/Upload';
import { useMutation, useQuery } from 'react-query';
import { uploadAttachment } from '@app/services/Attachment';
import {
  BankOutlined,
  ClearOutlined,
  DeleteOutlined,
  FilePdfTwoTone,
  FundTwoTone,
  InboxOutlined,
  InfoCircleTwoTone,
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  PushpinOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Radio, Row, Steps, Tabs, TreeSelect } from 'antd';
import { Space, message, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';

import { getAllCities, getAllCountries, getAllRegions } from '@app/services/locations';
import { useAtom } from 'jotai';
import { countries } from '../Admin/Locations/Countries';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useNavigate, useParams } from 'react-router-dom';
import { cities } from '../Admin/Locations/Cities';
import { getAllServices, getAllSubServices } from '@app/services/services';
import { getAllTools } from '@app/services/tools';
import { services } from '../Admin/Services';
import { createCompany } from '@app/services/company';
import { Card } from '@app/components/common/Card/Card';
import { TextArea } from '../Admin/Translations';

const { TabPane } = Tabs;
const { Step } = Steps;

export const AddCompany: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  const [attachments, setAttachments] = useState<any[]>([]);
  const [refetchOnAddManager, setRefetchOnAddManager] = useState(false);
  const [countryPage, setCountryPage] = useAtom(currentGamesPageAtom);
  const [countryPageSize, setcountryPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<cities[] | undefined>();
  const [Dat, setDat] = useState<services[] | undefined>();
  const [Datr, setDatr] = useState<subservices[] | undefined>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [countryData, setCountryData] = useState<countries[]>();
  const [id, SetId] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState(false);

  const { countryId } = useParams();
  const [Contry_id, setContryId] = useState(0);
  const [City_id, setCityId] = useState(0);
  const [Region_id, setRegionId] = useState(0);
  const [Serviece_id, setServieceId] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSucces, setUploadSucces] = useState(false);
  const [uploadSucce, setUploadSucce] = useState(false);
  const [uploadSucc, setUploadSucc] = useState(false);
  const [uploadedPhotoPR, setUploadedPhotoPR] = useState('');
  const [uploadedPhotoid, setUploadedPhotoid] = useState('');
  const [uploadedPhotoreg, setUploadedPhotoreg] = useState('');
  const [uploadedPhotoidin, setUploadedPhotoidin] = useState('');
  const [services, setServices] = useState([{ serviceId: '', subserviceId: '' }]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>([]);
  const [selectedSubService, setSelectedSubService] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [attachmentId, setAttachmentId] = useState<number>(0);
  const [urlAfterUpload, setUrlAfterUpload] = useState('');
  const [valueRadio, setValueRadio] = useState(1);
  const [logo, setLogo] = useState();
  const [OwnerIdentityIds, setOwnerIdentityIds] = useState();
  const [CommercialRegisterIds, setCommercialRegisterIds] = useState();
  const [additionalAttachmentIds, setAdditionalAttachmentIds] = useState();

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
  const [activeTab, setActiveTab] = useState('1');

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleBranchChange = (index: number, field: string, value: string) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

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

  let record: services | undefined;

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

  const ChangeSubServieceHandler = (index: any, e: any) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], subserviceId: e };
    setServices(updatedServices);
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
  };

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
            console.log(photoId);
            console.log(updatedFormData);
            handleUploadSuccess(photoUrl);
          }

          return updatedFormData;
        });
      })
      .catch((error) => {
        message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
      }),
  );

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
    regionId: Region_id,
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
    companyOwnerIdentityIds: [0],
    companyCommercialRegisterIds: [0],
    additionalAttachmentIds: [0],
    availableCitiesIds: [],
  };

  const [formData, setFormData] = useState<CompanyModal>(companyInfo);

  const addCompany = useMutation((data: CompanyModal) =>
    createCompany(data)
      .then((data: any) => {
        notificationController.success({ message: t('companies.addCompanySuccessMessage') });
        setRefetchOnAddManager(data.data?.success);
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
      }),
  );

  const navigate = useNavigate();

  const onFinish = (values: any) => {
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
        dialCode: '+963',
        phoneNumber: form.getFieldValue(['companyContact', 'phoneNumber']),
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: false,
      },
      userDto: {
        dialCode: '+963',
        phoneNumber: form.getFieldValue(['userDto', 'phoneNumber']),
        password: form.getFieldValue(['userDto', 'password']),
      },
      serviceType: valueRadio,
      services: services,
      companyProfilePhotoId: logo,
      companyCommercialRegisterIds: [CommercialRegisterIds],
      additionalAttachmentIds: [additionalAttachmentIds],
      companyOwnerIdentityIds: [OwnerIdentityIds],
      comment: form.getFieldValue('comment'),
    };
    const updatedFormData = { ...formData };

    console.log(companyInfo);
    updatedFormData.translations = companyInfo.translations;
    updatedFormData.companyOwnerIdentityIds = updatedFormData.companyOwnerIdentityIds.filter((id: any) => id !== 0);
    updatedFormData.companyCommercialRegisterIds = updatedFormData.companyCommercialRegisterIds.filter(
      (id: any) => id !== 0,
    );
    updatedFormData.additionalAttachmentIds = updatedFormData.additionalAttachmentIds.filter((id: any) => id !== 0);
    updatedFormData.isActive = true;
    addCompany.mutate(companyInfo);
    navigate('/companies');
  };

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
            Done
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
                <UserOutlined />
              ) : index === 1 ? (
                <PushpinOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : index === 3 ? (
                <ClearOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <BaseForm form={form} onFinish={onFinish} name="CompanyForm">
        {current === 0 && (
          <>
            <Row>
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              style={{ width: '50%', margin: 'auto' }}
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
              style={{ width: '50%', margin: 'auto' }}
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
              style={{ width: '50%', margin: 'auto' }}
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              </Col>
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
            </Row>
            <Row>
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
              <Col style={{ width: '40%', margin: '0 5%' }}>
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
            <BaseForm.Item
              name={['userDto', 'phoneNumber']}
              label={<LableText>{t('companies.PhoneNumber')}</LableText>}
              style={{ width: '50%', margin: 'auto' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Input />
            </BaseForm.Item>
            <BaseForm.Item
              name={['userDto', 'password']}
              label={<LableText>{t('companies.password')}</LableText>}
              style={{ width: '50%', margin: 'auto' }}
              rules={[
                { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
              ]}
            >
              <Input />
            </BaseForm.Item>
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
                      style={{ width: '50%', margin: 'auto' }}
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
                      style={{ width: '50%', margin: 'auto' }}
                    >
                      <Select onChange={(e) => ChangeSubServieceHandler(index, e)}>
                        {Datr?.map((subservices) => (
                          <Option key={subservices.id} value={subservices.id}>
                            {subservices.name}
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
                    onClick={() => setServices([...services, { serviceId: '', subserviceId: '' }])}
                  >
                    <PlusOutlined />
                    {/* <CreateButtonText>
                  </CreateButtonText> */}
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
            <UploadDragger
              style={{ width: '50%', margin: 'auto', marginBottom: '2rem' }}
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
                  {attachments[1]?.reftype === '9' && (
                    <img
                      src={attachments[1]?.url}
                      alt={attachments[1]?.name}
                      style={{ width: '100px', height: '100px' }}
                    />
                  )}
                </Space>
              ) : (
                <>
                  {uploadSucces ? (
                    <div>
                      <img src={uploadedPhotoid} alt="Uploaded photo" style={{ width: '50px', height: '50px' }} />
                    </div>
                  ) : (
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined /> <FilePdfTwoTone />
                    </p>
                  )}
                </>
              )}
            </UploadDragger>

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
            <UploadDragger
              style={{ width: '50%', margin: 'auto', marginBottom: '2rem' }}
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
                  {uploadSucce ? (
                    <div>
                      <img src={uploadedPhotoreg} alt="Uploaded photo" style={{ width: '50px', height: '50px' }} />
                    </div>
                  ) : (
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined /> <FilePdfTwoTone />
                    </p>
                  )}
                </>
              )}
            </UploadDragger>

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
            <UploadDragger
              style={{ width: '50%', margin: 'auto', marginBottom: '2rem' }}
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
                  <img
                    src={attachments[3]?.url}
                    alt={attachments[3]?.name}
                    style={{ width: '100px', height: '100px' }}
                  />
                </Space>
              ) : (
                <>
                  {uploadSucc ? (
                    <div>
                      <img src={uploadedPhotoidin} alt="Uploaded photo" style={{ width: '50px', height: '50px' }} />
                    </div>
                  ) : (
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined /> <FilePdfTwoTone />
                    </p>
                  )}
                </>
              )}
            </UploadDragger>

            <BaseForm.Item key={88} name="comment">
              <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder="comment" />
            </BaseForm.Item>
          </>
        )}
      </BaseForm>
    </Card>
  );
};
