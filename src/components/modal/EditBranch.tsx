import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CreateButtonText, LableText, treeStyle } from '../GeneralStyles';
import { useResponsive } from '@app/hooks/useResponsive';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { BranchModel } from '@app/interfaces/interfaces';
import { Select, Option } from '../common/selects/Select/Select';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BankOutlined, ClearOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Steps, Image, Tree } from 'antd';
import { useTranslation } from 'react-i18next';
import { notificationController } from '@app/controllers/notificationController';
import { getCities, getCountries, getRegions } from '@app/services/locations';
import { useNavigate, useParams } from 'react-router-dom';
import { getServices } from '@app/services/services';
import { getBranch, UpdateBranch } from '@app/services/branches';
import { Card } from '@app/components/common/Card/Card';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import type { DataNode } from 'antd/es/tree';

const { Step } = Steps;
const requestServicesArray: any = [];
let requestServices: any = [];
const keeey: any = [];
const steps = [
  {
    title: 'BranchInformation',
  },
  {
    title: 'Services',
  },
];
let branchInfo: any = {
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
    dialCode: '0',
    phoneNumber: '0',
    emailAddress: 'string',
    webSite: 'string',
    isForBranchCompany: false,
  },
};

export const EditBranch: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { companyId, branchId } = useParams();
  const queryClient = useQueryClient();

  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState<string>('0');
  const [regionId, setRegionId] = useState<string>('0');
  const { isDesktop, isTablet, isMobile, mobileOnly } = useResponsive();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<BranchModel>(branchInfo);
  const [branchData, setbranchData] = useState<BranchModel>(branchInfo);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState(
    branchData.companyContact?.dialCode + branchData.companyContact?.phoneNumber,
  );
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [GetBranch, setGetBranch] = useState<boolean>(true);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(keeey);

  const { data, status, refetch, isRefetching } = useQuery(
    ['GetBranchById'],
    () =>
      getBranch(branchId)
        .then((data) => {
          const result = data.data?.result;
          setbranchData(result);
          setGetBranch(false);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: GetBranch,
    },
  );

  const GetAllServices = useQuery('getAllServices', getServices);

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    const serviceNode: DataNode = {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <p>{service.id}</p>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `service${service?.id}`,
      children: [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
    if (service?.subServices?.length > 0) {
      serviceNode.children = service.subServices.map((subService: any) => {
        const subServiceNode = {
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <p>{subService.id}</p>
              <Image src={subService?.attachment?.url} width={16} height={16} />
              {subService?.name}
            </span>
          ),
          key:
            subService?.tools?.length > 0
              ? `service${service?.id} sub${subService?.id}`
              : `onlySub service${service?.id} sub${subService?.id}`,
          children: [],
        };
        if (subService?.tools?.length > 0) {
          subServiceNode.children = subService.tools.map((tool: any) => ({
            title: (
              <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                <p>{tool.id}</p>
                <Image src={tool?.attachment?.url} width={16} height={16} />
                {tool?.name}
              </span>
            ),
            key: `withTool service${service?.id} sub${subService?.id} tool${tool?.id}`,
          }));
        }
        return subServiceNode;
      });
    }
    return serviceNode;
  });

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  const GetAllCountries = useQuery('GetAllCountries', getCountries);
  const { data: citiesData, refetch: citiesRefetch } = useQuery('getCities', () => getCities(countryId), {
    enabled: countryId !== '0',
  });
  const { data: RegionsData, refetch: RegionsRefetch } = useQuery('getRegions', () => getRegions(cityId), {
    enabled: cityId !== '0',
  });
  useEffect(() => {
    if (countryId !== '0') {
      citiesRefetch();
      RegionsRefetch();
    }
  }, [countryId]);
  useEffect(() => {
    if (cityId !== '0') {
      RegionsRefetch();
    }
  }, [cityId]);

  const ChangeCountryHandler = (e: any) => {
    setCountryId(e);
    form.setFieldValue('cityId', '');
    form.setFieldValue('regionId', '');
  };

  const ChangeCityHandler = (e: any) => {
    setCityId(e);
    form.setFieldValue('regionId', '');
  };

  const ChangeRegionHandler = (e: any) => {
    setRegionId(e);
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

  const editBranch = useMutation((data: BranchModel) =>
    UpdateBranch(data)
      .then((data: any) => {
        notificationController.success({ message: t('branch.editBranchSuccessMessage') });
        queryClient.invalidateQueries('getAllBranches');
        navigate(`/companies/${companyId}/branches`);
        requestServices = [];
      })
      .catch((error) => {
        notificationController.error({ message: error.message || error.error?.message });
        requestServices = [];
      }),
  );

  const onFinish = (values: any) => {
    const { dialCode: dialCodeC, phoneNumber: phoneNumberC } = extractDialCodeAndPhoneNumber(formattedPhoneNumber);
    function extractServicesIds(input: any) {
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          requestServices.push(result);
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          requestServices.push(result);
        }
        console.log(requestServices);

        return result;
      });
    }
    extractServicesIds(requestServicesArray);
    const updatedFormData = { ...formData };
    branchInfo = {
      ...branchInfo,
      id: branchId,
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
        dialCode: dialCodeC != '0' ? '+' + dialCodeC : branchData.companyContact.dialCode,
        phoneNumber: phoneNumberC != '0' ? phoneNumberC : branchData.companyContact.phoneNumber,
        emailAddress: form.getFieldValue(['companyContact', 'emailAddress']),
        webSite: form.getFieldValue(['companyContact', 'webSite']),
        isForBranchCompany: true,
      },
      services: requestServices,
      regionId: regionId != '0' ? regionId : branchData?.region?.id,
    };
    updatedFormData.translations = branchInfo.translations;
    editBranch.mutate(branchInfo);
  };

  {
    status === 'success' &&
      branchData &&
      branchData?.services.map((service: any) => {
        service?.subServices.map((subService: any) => {
          subService?.tools.map((tool: any) => {
            keeey.push(`withTool service${service.id} sub${subService?.id} tool${tool?.id}`);
          });
        });
      });
  }

  return (
    <Card title={t('branch.editBranch')} padding="1.25rem 1.25rem 1.25rem">
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
            {t('common.prev')}
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
            // disabled={editBranch.isLoading || uploadImage.isLoading}
            disabled={editBranch.isLoading}
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
      {status === 'success' && branchData && (
        <BaseForm
          form={form}
          onFinish={onFinish}
          name="EditBranchForm"
          style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
          initialValues={{
            ...branchData,
            phonee: branchData.companyContact?.dialCode + branchData.companyContact?.phoneNumber,
          }}
        >
          {current === 0 && (
            <>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'name']}
                    label={<LableText>{t('companies.CompanyNamear')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'name']}
                    label={<LableText>{t('companies.name')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'bio']}
                    label={<LableText>{t('companies.Companybioar')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'bio']}
                    label={<LableText>{t('companies.bio')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 0, 'address']}
                    label={<LableText>{t('companies.addressA')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    name={['translations', 1, 'address']}
                    label={<LableText>{t('companies.address')}</LableText>}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
              </Row>

              <BaseForm.Item
                // name="countryId"
                label={<LableText>{t('companies.Country name')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeCountryHandler} defaultValue={branchData?.region?.city?.country?.name}>
                  {GetAllCountries?.data?.data?.result?.items.map((country: any) => (
                    <Option key={country.id} value={country.id}>
                      {country?.name}
                    </Option>
                  ))}
                </Select>
              </BaseForm.Item>

              <BaseForm.Item
                name="cityId"
                label={<LableText>{t('companies.City name')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeCityHandler} defaultValue={branchData?.region?.city?.name}>
                  {citiesData?.data?.result?.items.map((city: any) => (
                    <Select key={city.name} value={city.id}>
                      {city?.name}
                    </Select>
                  ))}
                </Select>
              </BaseForm.Item>

              <BaseForm.Item
                name="regionId"
                label={<LableText>{t('companies.Regionname')}</LableText>}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Select onChange={ChangeRegionHandler} defaultValue={branchData?.region?.name}>
                  {RegionsData?.data?.result?.items.map((Region: any) => (
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
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    label={<LableText>{t('companies.CompanyEmail')}</LableText>}
                    name={['companyContact', 'emailAddress']}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input />
                  </BaseForm.Item>
                </Col>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseForm.Item
                    label={<LableText>{t('companies.website')}</LableText>}
                    name={['companyContact', 'webSite']}
                    style={{ marginTop: '-1rem' }}
                    rules={[
                      {
                        required: true,
                        message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p>,
                      },
                    ]}
                  >
                    <Input value={branchInfo?.companyContact?.webSite} />
                  </BaseForm.Item>
                </Col>
              </Row>

              <Row style={{ justifyContent: 'space-around' }}>
                <Col
                  style={isDesktop || isTablet ? { width: '40%', margin: '0 5%' } : { width: '80%', margin: '0 10%' }}
                >
                  <BaseButtonsForm.Item
                    key={current}
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
                    style={{ margin: '2%', direction: localStorage.getItem('movers&-lang') == 'en' ? 'ltr' : 'rtl' }}
                  >
                    <PhoneInput
                      value={branchData.companyContact?.dialCode + branchData.companyContact?.phoneNumber}
                      key={1}
                      onChange={handleFormattedValueChange}
                      country={'ae'}
                    />
                  </BaseButtonsForm.Item>
                </Col>
              </Row>
            </>
          )}

          {current === 1 && (
            <>
              <BaseForm.Item key="100" name="services">
                {treeData?.map((serviceTreeData: any, serviceIndex: number) => {
                  const serviceKeys = selectedServicesKeysMap[serviceIndex] || keeey;

                  return (
                    <Tree
                      key={serviceIndex}
                      style={treeStyle}
                      checkable
                      defaultExpandAll={true}
                      onExpand={onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={(checkedKeysValue: any) => {
                        setCheckedKeys((prev) => ({ ...prev } + { ...checkedKeysValue }));

                        setSelectedServicesKeysMap((prevSelectedKeysMap) => {
                          const updatedKeysMap = { ...prevSelectedKeysMap };
                          updatedKeysMap[serviceIndex] = checkedKeysValue;
                          return updatedKeysMap;
                        });

                        for (const key of checkedKeys) {
                          if (!requestServicesArray.includes(key)) {
                            requestServicesArray.push(key);
                          }
                        }
                      }}
                      // onCheck={(checkedKeysValue: any) => {
                      //   for (const key of checkedKeysValue) {
                      //     if (!requestServicesArray.includes(key)) {
                      //       requestServicesArray.push(key);
                      //     }
                      //   }
                      //   setCheckedKeys(checkedKeysValue);

                      //   setSelectedServicesKeysMap((prevSelectedKeysMap) => {
                      //     const updatedKeysMap = { ...prevSelectedKeysMap };
                      //     updatedKeysMap[serviceIndex] = checkedKeysValue;
                      //     return updatedKeysMap;
                      //   });
                      // }}
                      defaultCheckedKeys={keeey}
                      checkedKeys={serviceKeys}
                      onSelect={onSelect}
                      selectedKeys={selectedKeys}
                      treeData={[serviceTreeData]}
                    />
                  );
                })}
              </BaseForm.Item>
            </>
          )}
        </BaseForm>
      )}
    </Card>
  );
};
