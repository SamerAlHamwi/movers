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
  ClearOutlined,
  FilePdfTwoTone,
  FundTwoTone,
  InboxOutlined,
  InfoCircleTwoTone,
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Input, Tabs, TreeSelect } from 'antd';
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

const { TabPane } = Tabs;

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
  // Define a state variable to keep track of the active tab
  const [activeTab, setActiveTab] = useState('1');

  // Function to navigate to the next tab
  const next = () => {
    setActiveTab((parseInt(activeTab) + 1).toString());
  };

  // Function to navigate to the previous tab
  const prev = () => {
    setActiveTab((parseInt(activeTab) - 1).toString());
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

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSucces, setUploadSucces] = useState(false);
  const [uploadSucce, setUploadSucce] = useState(false);
  const [uploadSucc, setUploadSucc] = useState(false);
  const [uploadedPhotoPR, setUploadedPhotoPR] = useState('');
  const [uploadedPhotoid, setUploadedPhotoid] = useState('');
  const [uploadedPhotoreg, setUploadedPhotoreg] = useState('');
  const [uploadedPhotoidin, setUploadedPhotoidin] = useState('');
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
  // let record: services | undefined;
  // const ChangeServieceHandler = (e: any) => {
  //   setServieceId(e);

  //   getAllSubServices(e, page, pageSize)
  //     .then((data) => {
  //       const result = data.data?.result?.items;
  //       setTotalCount(data.data?.result?.totalCount);
  //       setDatr(result);
  //     })
  //     .catch((error) => {
  //       notificationController.error({ message: error.message || error.error?.message });
  //     });

  //   if ((record?.tools ?? []).length > 0) {
  //     getAllTools(e, '', page, pageSize)
  //       .then((data) => {
  //         const result = data?.data?.result?.items;
  //         setTotalCount(data?.data?.result?.totalCount);
  //         setData(result);
  //       })
  //       .catch((error) => {
  //         notificationController.error({ message: error.message || error.error?.message });
  //       });
  //   }
  // };

  // let record: services | undefined;
  // const changeServiceHandler = (value: string[]) => {
  //   setSelectedServices(value);

  //   // Fetch sub-services and tools for each selected service
  //   value.forEach((serviceId) => {
  //     getAllSubServices(serviceId, page, pageSize)
  //       .then((data) => {
  //         const result = data.data?.result?.items;
  //         setSubServices((prevSubServices) => [...prevSubServices, result]);
  //       })
  //       .catch((error) => {
  //         notificationController.error({ message: error.message || error.error?.message });
  //       });

  //     if (record && record.tools && record.tools.length > 0) {
  //       getAllTools(serviceId, '', page, pageSize)
  //         .then((data) => {
  //           const result = data?.data?.result?.items;
  //           setTools((prevTools) => [...prevTools, result]);
  //         })
  //         .catch((error) => {
  //           notificationController.error({ message: error.message || error.error?.message });
  //         });
  //     }
  //   });
  // };
  const [services, setServices] = useState([{ serviceId: '', subserviceId: '' }]);
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
        const photoId = response.data.result.id;
        const refType = response.data.result.refType;
        const photoUrl = response.data.result.url;
        console.log('sdfghjk', refType);
        console.log('sdfghjk', photoId);
        setFormData((prevFormData) => {
          console.log('Previous FormData:', prevFormData);
          let updatedFormData = { ...prevFormData };
          if (refType === 9) {
            updatedFormData = {
              ...updatedFormData,
              companyOwnerIdentityIds: [...updatedFormData.companyOwnerIdentityIds, photoId],
            };
            handleUploadSucces(photoUrl);
          } else if (refType === 10) {
            updatedFormData = {
              ...updatedFormData,
              companyCommercialRegisterIds: [...updatedFormData.companyCommercialRegisterIds, photoId],
            };
            handleUploadSucce(photoUrl);
          } else if (refType === 11) {
            updatedFormData = {
              ...updatedFormData,
              additionalAttachmentIds: [...updatedFormData.additionalAttachmentIds, photoId],
            };
            handleUploadSucc(photoUrl);
          } else if (refType === 8) {
            updatedFormData = {
              ...updatedFormData,
              companyProfilePhotoId: photoId,
            };
            handleUploadSuccess(photoUrl);
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
    address: 'string',

    companyContact: {
      dialCode: 's7',
      phoneNumber: 'string',
      emailAddress: 'string',
      webSite: 'string',
      isForBranchCompany: false,
    },

    companyProfilePhotoId: 0,
    companyOwnerIdentityIds: [0],
    companyCommercialRegisterIds: [0],
    additionalAttachmentIds: [0],
    availableCitiesIds: [],
    userDto: {
      dialCode: '963',
      phoneNumber: '0997829849',
      password: '865fghjk',
    },
    isActive: true,
    comment: 'string',
    serviceType: 1,
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
    setFormData(updatedFormData);
    addCompany.mutate(updatedFormData);
    navigate('/companies'); // Sending the updatedFormData when the submit button is pressed
  };
  const handleTabChange = (key: any) => {
    setActiveTab(key);
  };

  return (
    <div>
      <BaseForm form={form} onFinish={onFinish} name="CompanyForm">
        <Tabs activeKey={activeTab} onChange={handleTabChange} defaultActiveKey="1">
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
              name={['translations', 0, 'address']}
              label={<LableText>{t('companies.addressA')}</LableText>}
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
              name={['translations', 1, 'address']}
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
              style={{ marginTop: '-1rem' }}
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
                  {uploadSuccess ? (
                    <div>
                      <img src={uploadedPhotoPR} alt="Uploaded photo" style={{ width: '50px', height: '50px' }} />
                    </div>
                  ) : (
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                  )}
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
            ></h2>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <Button
                type="primary"
                style={{
                  margin: '1rem 1rem 1rem 0',
                  width: 'auto',
                  height: 'auto',
                }}
                onClick={() => prev()}
              >
                <CreateButtonText> {t('common.Previous')}</CreateButtonText>
              </Button>
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
            </div>
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
                {index !== 0 && (
                  <Button
                    type="primary"
                    style={{
                      margin: '2rem 2rem 2rem 0',
                      width: 'auto',
                      height: 'auto',
                    }}
                    onClick={() => removeService(index)}
                  >
                    <CreateButtonText>{t('companies.Remove')}</CreateButtonText>
                  </Button>
                )}
                <BaseForm.Item
                  label={<LableText>{t('companies.selectService')}</LableText>}
                  name={['services', index, 'serviceId']}
                  style={{ marginTop: '-1rem' }}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
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
                  style={{ marginTop: '-1rem' }}
                >
                  <Select>
                    {Datr?.map((subservices) => (
                      <Option key={subservices.id} value={subservices.id}>
                        {subservices.name}
                      </Option>
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
              onClick={() => setServices([...services, { serviceId: '', subserviceId: '' }])}
            >
              <CreateButtonText>{t('companies.Add Service')}</CreateButtonText>
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <Button
                type="primary"
                style={{
                  margin: '1rem 1rem 1rem 0',
                  width: 'auto',
                  height: 'auto',
                }}
                onClick={() => prev()}
              >
                <CreateButtonText> {t('common.Previous')}</CreateButtonText>
              </Button>
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
            </div>
          </TabPane>
          <TabPane
            tab={
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '20px' }}>
                <FundTwoTone style={{ fontSize: '20px' }} /> {t('companies.Attachment')}
              </span>
            }
            key="3"
          >
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              {/* <BaseForm.Item>
            <Button onClick={onCancel} style={{ marginRight: '1rem' }}>
              {t('common.cancel')}
            </Button>
          </BaseForm.Item> */}
              <BaseForm.Item>
                <Button
                  type="primary"
                  style={{
                    margin: '1rem 1rem 1rem 0',
                    width: 'auto',
                    height: 'auto',
                  }}
                  disabled={addCompany.isLoading || uploadImage.isLoading}
                  onClick={() => onFinish(form.getFieldsValue())}
                >
                  {addCompany.isLoading || uploadImage.isLoading ? (
                    <LoadingOutlined style={{ fontSize: FONT_SIZE.md }} spin />
                  ) : (
                    <CreateButtonText>{t('common.submit')}</CreateButtonText>
                  )}
                </Button>
              </BaseForm.Item>
            </div>
          </TabPane>
        </Tabs>
        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}> */}
        {/* <BaseForm.Item>
            <Button onClick={onCancel} style={{ marginRight: '1rem' }}>
              {t('common.cancel')}
            </Button>
          </BaseForm.Item> */}
        {/* <BaseForm.Item>
            <Button
              type="primary"
              style={{
                margin: '1rem 1rem 1rem 0',
                width: 'auto',
                height: 'auto',
              }}
              disabled={addCompany.isLoading || uploadImage.isLoading}
              onClick={() => onFinish(form.getFieldsValue())}
            >
              {addCompany.isLoading || uploadImage.isLoading ? (
                <LoadingOutlined style={{ fontSize: FONT_SIZE.md }} spin />
              ) : (
                <CreateButtonText>{t('common.submit')}</CreateButtonText>
              )}
            </Button>
          </BaseForm.Item>
        </div> */}
      </BaseForm>
    </div>
  );
};
