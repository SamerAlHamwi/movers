import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { BranchModel, CompanyModal, subservices } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useMutation, useQuery } from 'react-query';
import { BankOutlined, ClearOutlined, DeleteOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getAllCities, getAllCountries, getAllRegions } from '@app/services/locations';
import { useAtom } from 'jotai';
import { countries } from '../Admin/Locations/Countries';
import { currentGamesPageAtom, gamesPageSizeAtom } from '@app/constants/atom';
import { useNavigate, useParams } from 'react-router-dom';
import { cities } from '../Admin/Locations/Cities';
import { getServices, getSubServices } from '@app/services/services';
import { getTools } from '@app/services/tools';
import { services } from '../Admin/Services';
import { createBranch } from '@app/services/branches';
import { Card } from '@app/components/common/Card/Card';
import { tools } from '../Admin/Services/tools';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

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
  userDto: {
    dialCode: '963',
    phoneNumber: '0997829849',
    password: '865fghjk',
  },
};

export const AddBranch: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [countryPage, setCountryPage] = useAtom(currentGamesPageAtom);
  const [countryPageSize, setcountryPageSize] = useAtom(gamesPageSizeAtom);
  const [Data, setData] = useState<cities[] | undefined>();
  const [page, setPage] = useAtom(currentGamesPageAtom);
  const [pageSize, setPageSize] = useAtom(gamesPageSizeAtom);
  const [countryData, setCountryData] = useState<countries[]>();
  const [serviceId, setServiceId] = useState<string>('0');
  const [subServiceId, setSubServiceId] = useState<string>('0');
  const [toolId, setToolId] = useState<string>('0');

  const [Contry_id, setContryId] = useState(0);
  const [City_id, setCityId] = useState(0);
  const [Region_id, setRegionId] = useState(0);
  const [services, setServices] = useState([{ serviceId: '', subserviceId: '', toolId: '' }]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<CompanyModal>(companyInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  const GetAllServices = useQuery('getAllServices', getServices);
  const { data: subServicesData, refetch: subServicesRefetch } = useQuery(
    'getSubServices',
    () => getSubServices(serviceId),
    {
      enabled: serviceId !== '0',
    },
  );
  const { data: toolsData, refetch: toolsRefetch } = useQuery('getTools', () => getTools(subServiceId), {
    enabled: subServiceId !== '0',
  });
  useEffect(() => {
    subServicesRefetch();
    toolsRefetch();
  }, [serviceId, subServiceId]);

  const ChangeServieceHandler = (e: any, index: number) => {
    setServiceId(e);
    form.setFieldValue(['services', index, 'subserviceId'], '');
    form.setFieldValue(['services', index, 'toolId'], '');
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], serviceId: e };
    setServices(updatedServices);
  };

  const ChangeSubServiceHandler = (e: any, index: number) => {
    setSubServiceId(e);
    form.setFieldValue(['services', index, 'toolId'], '');
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], subserviceId: e };
    setServices(updatedServices);
  };

  const ChangeToolsHandler = (e: any, index: number) => {
    setToolId(e);
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], toolId: e };
    setServices(updatedServices);
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

  const removeService = (index: any) => {
    form.setFieldValue(['services', index, 'serviceId'], '');
    form.setFieldValue(['services', index, 'subserviceId'], '');
    form.setFieldValue(['services', index, 'toolId'], '');
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
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

  const addBranch = useMutation((data: BranchModel) =>
    createBranch(data)
      .then((data: any) => {
        notificationController.success({ message: t('branch.addBranchSuccessMessage') });
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
      companyId: companyId,
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
        isForBranchCompany: true,
      },
      userDto: {
        dialCode: '+' + dialCodeU,
        phoneNumber: phoneNumberU,
        password: form.getFieldValue(['userDto', 'password']),
      },
      services: services,
      regionId: Region_id,
    };
    updatedFormData.translations = companyInfo.translations;
    console.log(companyInfo);

    addBranch.mutate(companyInfo);
    navigate('/companies');
  };

  return (
    <Card title={t('branch.addBranch')} padding="1.25rem 1.25rem 1.25rem">
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
            // disabled={addBranch.isLoading || uploadImage.isLoading}
            disabled={addBranch.isLoading}
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
              {/* <Col style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}>
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
              </Col> */}
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
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option!.children?.toLowerCase().includes(input?.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                        }
                        onChange={(e) => ChangeServieceHandler(e, index)}
                      >
                        {GetAllServices?.data?.data?.result?.items?.map((ele: any) => {
                          return (
                            <Option value={ele.id} key={ele?.id}>
                              {ele.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </BaseForm.Item>
                    <BaseForm.Item
                      label={<LableText>{t('companies.selectSubService')}</LableText>}
                      name={['services', index, 'subserviceId']}
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
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option!.children?.toLowerCase().includes(input?.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                        }
                        onChange={(e) => ChangeSubServiceHandler(e, index)}
                        value={subServiceId}
                      >
                        {subServicesData?.data?.result?.items?.map((ele: any) => {
                          return (
                            <Option value={ele.id} key={ele?.id}>
                              {ele.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </BaseForm.Item>
                    <BaseForm.Item
                      label={<LableText>{t('companies.selectTool')}</LableText>}
                      name={['services', index, 'toolId']}
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
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option!.children?.toLowerCase().includes(input?.toLowerCase())
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                        }
                        onChange={(e) => ChangeToolsHandler(e, index)}
                      >
                        {toolsData?.data?.result?.items?.map((ele: any) => {
                          return (
                            <Option value={ele.id} key={ele?.id}>
                              {ele.name}
                            </Option>
                          );
                        })}
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

            {/* {services.map((service, index) => (
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
            ))} */}
          </>
        )}
      </BaseForm>
    </Card>
  );
};
