import React, { useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { message, Steps, Radio, Image, Row, Col, Space } from 'antd';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Card } from '@app/components/common/Card/Card';
import { CreateButtonText, treeStyle, LableText } from '../GeneralStyles';
import { Input } from '../Admin/Translations';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { Checkbox } from '../common/Checkbox/Checkbox';
import { BankOutlined, ClearOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { useResponsive } from '@app/hooks/useResponsive';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { TextArea } from '../Admin/Translations';
import { useQuery } from 'react-query';
import { getServices } from '@app/services/services';
import { getAttributeForSourceTypes, getSourceTypes } from '@app/services/sourceTypes';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { createRequest } from '@app/services/requests';
import { useMutation } from 'react-query';
import { Select, Option } from '../common/selects/Select/Select';
import { getCountries, getCities } from '@app/services/locations';
import { DatePicker } from '../common/pickers/DatePicker';
import { Alert } from '../common/Alert/Alert';

const { Step } = Steps;
let requestServicesArray: any = [];
const requestServices: any = [];
let requestSources: any = [];

export const AddRequest: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();

  const sourceLat = 25.15658048160557;
  const sourceLng = 55.34100848084654;
  const destinationLat = 25.180801685212185;
  const destinationLng = 55.281956967174665;

  const [current, setCurrent] = useState(0);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [sourcePosition, setSourcePosition] = useState({ lat: sourceLat, lng: sourceLng });
  const [destinationPosition, setDestinationPosition] = useState({ lat: destinationLat, lng: destinationLng });
  const [centerSource, setCenterSource] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  const [centerDestination, setCenterDestination] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [valueRadio, setValueRadio] = useState(1);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState({ source: '0', destination: '0' });
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [selectedSourceKeys, setSelectedSourceKeys] = useState<React.Key[] | any>([]);
  const [selectedSourceType, setSelectedSourceType] = useState('0');
  const [sourceType, setSourceType] = useState('0');

  const GetAllServices = useQuery('getAllServices', getServices);
  const GetAllSourceType = useQuery('GetAllSourceType', getSourceTypes);
  const GetAllCountry = useQuery('GetAllCountry', getCountries);
  const {
    data: cityData,
    refetch,
    isRefetching,
  } = useQuery('GetAllCity', () => getCities(countryId), {
    enabled: countryId !== '0',
  });

  const {
    data: attributeForSourceTypesData,
    refetch: AttributeForSourceTypesRefetch,
    isRefetching: attributeForSourceTypesAttributeForSourceTypes,
  } = useQuery('AttributeForSourceTypes', () => getAttributeForSourceTypes(selectedSourceType), {
    refetchOnWindowFocus: false,
    enabled: Number(selectedSourceType) !== 0,
  });

  useEffect(() => {
    refetch();
  }, [countryId]);

  useEffect(() => {
    AttributeForSourceTypesRefetch();
  }, [selectedSourceType, sourceType]);

  const handleMapClick = (event: google.maps.MapMouseEvent, positionType: 'source' | 'destination') => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      if (positionType === 'source') {
        setSourcePosition({ lat: newLat, lng: newLng });
      } else if (positionType === 'destination') {
        setDestinationPosition({ lat: newLat, lng: newLng });
      }
    }
  };

  const steps = [
    {
      title: 'Contact',
      content: [
        'Source',
        'firstNameContactSource',
        'lastNameContactSource',
        'phoneNumberSource',
        'isCallAvailableSource',
        'isWhatsAppAvailableSource',
        'isTelegramAvailableSource',
        'Destination',
        'firstNameContactDestination',
        'lastNameContactDestination',
        'phoneNumberDestination',
        'isCallAvailableDestination',
        'isWhatsAppAvailableDestination',
        'isTelegramAvailableDestination',
      ],
    },
    {
      title: 'Location',
      content: [
        'Source',
        'sourceCountry',
        'sourceCity',
        'sourceAddress',
        'moveAtUtc',
        'sourceLocation',
        'Destination',
        'destinationCountry',
        'destinationCity',
        'destinationAddress',
        'arrivalAtUtc',
        'destinationLocation',
      ],
    },
    {
      title: 'Services',
      content: ['serviceType', 'services', 'comment'],
    },
    {
      title: 'SourceType',
      content: ['sourceTypeId', 'attributeForSourceTypeValues', 'attributeChoiceAndAttachments'],
    },
  ];

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    const serviceNode: DataNode = {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>{service?.name}</span>
        </span>
      ),
      key: `withService service${service?.id}`,
      children: [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
    if (service?.subServices?.length > 0) {
      serviceNode.children = service.subServices.map((subService: any) => {
        const subServiceNode = {
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              <Image src={subService?.attachment?.url} width={16} height={16} />
              {subService?.name}
            </span>
          ),
          key: `withSub service${service?.id} sub${subService?.id}`,
          children: [],
        };
        if (subService?.tools?.length > 0) {
          subServiceNode.children = subService.tools.map((tool: any) => ({
            title: (
              <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
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

  const treeDataSourceType: DataNode[] = attributeForSourceTypesData?.data?.result?.items?.map((sourceType: any) => {
    const sourceTypeNode: DataNode = {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <span style={{ fontWeight: 'bold' }}>{sourceType?.name}</span>
        </span>
      ),
      key: `onlySource attributeForSourceType${sourceType?.id}`,
      children: [],
    };
    if (sourceType?.attributeChoices?.length > 0) {
      sourceTypeNode.children = sourceType.attributeChoices.map((parentAttributeChoice: any) => {
        const parentAttributeChoiceNode = {
          title: (
            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
              {parentAttributeChoice?.name}
            </span>
          ),
          key: `sourceWithAttribute attributeForSourceType${sourceType?.id} parentAttributeChoice${parentAttributeChoice?.id}`,
          children: [],
        };
        if (parentAttributeChoice) return parentAttributeChoiceNode;
      });
    }
    return sourceTypeNode;
  });

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
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

  const ChangeCountryHandler = (e: any, positionType: 'source' | 'destination') => {
    setCountryId(e);
    if (positionType === 'source') {
      form.setFieldValue('sourceCity', '');
    } else if (positionType === 'destination') {
      form.setFieldValue('destinationCity', '');
    }
  };

  const ChangeCityHandler = (e: any, positionType: 'source' | 'destination') => {
    if (positionType === 'source') {
      setCityId((prevCityId) => ({ ...prevCityId, source: e }));
    } else if (positionType === 'destination') {
      setCityId((prevCityId) => ({ ...prevCityId, destination: e }));
    }
  };

  const extractDialCodeAndPhoneNumber = (fullPhoneNumber: string) => {
    const dialCode = fullPhoneNumber.substring(0, fullPhoneNumber.indexOf('+') + 4);
    const phoneNumber = fullPhoneNumber.substring(dialCode.length);
    return {
      dialCode,
      phoneNumber,
    };
  };

  const createRequestMutation = useMutation((id: any) =>
    createRequest(id)
      .then((data) => {
        data.data?.success &&
          message.open({
            content: <Alert message={t('requests.deleteRequestSuccessMessage')} type={`success`} showIcon />,
          });
        requestServicesArray = [];
        requestSources = [];
        setSelectedSourceKeys([]);
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
        requestServicesArray = [];
        requestSources = [];
        setSelectedSourceKeys([]);
      }),
  );

  const onFinish = async (values: any) => {
    const { dialCode: dialCodeS, phoneNumber: phoneNumberS } = extractDialCodeAndPhoneNumber(
      form.getFieldValue('phoneNumberSource'),
    );
    const { dialCode: dialCodeD, phoneNumber: phoneNumberD } = extractDialCodeAndPhoneNumber(
      form.getFieldValue('phoneNumberDestination'),
    );
    const sourceContact = {
      dailCode: dialCodeS,
      phoneNumber: phoneNumberS,
      firstNameContact: form.getFieldValue('firstNameContactSource'),
      lastNameContact: form.getFieldValue('lastNameContactSource'),
      isCallAvailable: form.getFieldValue('isCallAvailableSource') == undefined ? false : true,
      isWhatsAppAvailable: form.getFieldValue('isWhatsAppAvailableSource') == undefined ? false : true,
      isTelegramAvailable: form.getFieldValue('isTelegramAvailableSource') == undefined ? false : true,
      requestForQuotationContactType: 1,
    };
    const destinationContact = {
      dailCode: dialCodeD,
      phoneNumber: phoneNumberD,
      firstNameContact: form.getFieldValue('firstNameContactDestination'),
      lastNameContact: form.getFieldValue('lastNameContactDestination'),
      isCallAvailable: form.getFieldValue('isCallAvailableDestination') == undefined ? false : true,
      isWhatsAppAvailable: form.getFieldValue('isWhatsAppAvailableDestination') == undefined ? false : true,
      isTelegramAvailable: form.getFieldValue('isTelegramAvailableDestination') == undefined ? false : true,
      requestForQuotationContactType: 2,
    };

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
        } else if (parts[0] == 'withSub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
        } else if (parts[0] == 'withService') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: null,
            toolId: null,
          };
        }
        // } else if (parts[0] == 'withoutTool') {
        //   result = {
        //     serviceId: parseInt(parts[1].replace('service', '')),
        //     subServiceId: parseInt(parts[2].replace('sub', '')),
        //     toolId: null,
        //     toolRelationType: null,
        //   };
        // }
        requestServices.push(result);
        return result;
      });
    }
    extractServicesIds(requestServicesArray);

    function extractSourcesIds(input: any) {
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'sourceWithAttribute') {
          result = {
            attributeForSourcTypeId: parseInt(parts[1].replace('attributeForSourceType', '')),
            attributeChoiceId: parseInt(parts[2].replace('parentAttributeChoice', '')),
          };
        }
        requestSources.push(result);
        return result;
      });
    }
    extractSourcesIds(selectedSourceKeys);

    const requestData = {
      sourceCityId: cityId.source,
      sourceAddress: form.getFieldValue('sourceAddress'),
      sourceLongitude: sourcePosition.lng,
      sourceLatitude: sourcePosition.lat,
      moveAtUtc: form.getFieldValue('moveAtUtc'),

      destinationCityId: cityId.destination,
      destinationAddress: form.getFieldValue('destinationAddress'),
      destinationLongitude: destinationPosition.lng,
      destinationLatitude: destinationPosition.lat,
      arrivalAtUtc: form.getFieldValue('arrivalAtUtc'),

      requestForQuotationContacts: [sourceContact, destinationContact],
      serviceType: valueRadio,
      comment: form.getFieldValue('comment'),
      services: requestServices,

      sourceTypeId: selectedSourceType,
      attributeForSourceTypeValues: requestSources,
    };
    createRequestMutation.mutateAsync(requestData);
  };

  return (
    <Card title={t('addRequest.addRequest')} padding="1.25rem 1.25rem 1.25rem">
      <Steps current={current} style={{ margin: '10px 10px 30px 0', padding: '0px 40px' }}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={t(`addRequest.${step.title}`)}
            icon={
              index === 0 ? (
                <UserOutlined />
              ) : index === 1 ? (
                <PushpinOutlined />
              ) : index === 2 ? (
                <ClearOutlined />
              ) : index === 3 ? (
                <BankOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>
      <BaseForm
        form={form}
        onFinish={onFinish}
        name="addRequestForm"
        style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
      >
        {steps[current].content.map((fieldName: string, index: number) => {
          const label = t(`addRequest.${fieldName}`);
          const isPhone = ['phoneNumberSource', 'phoneNumberDestination'].includes(fieldName);
          const isRadio = fieldName === 'serviceType';
          const isTextArea = fieldName === 'comment';
          const isTreeService = fieldName === 'services';
          const isTreeSource = fieldName === 'attributeForSourceTypeValues';
          const isSelectCountry = ['sourceCountry', 'destinationCountry'].includes(fieldName);
          const isSelectCity = ['sourceCity', 'destinationCity'].includes(fieldName);
          const isSelectSourceType = fieldName === 'sourceTypeId';
          const isDatePicker = ['moveAtUtc', 'arrivalAtUtc'].includes(fieldName);
          const isInput = [
            'firstNameContactSource',
            'lastNameContactSource',
            'firstNameContactDestination',
            'lastNameContactDestination',
            'sourceAddress',
            'destinationAddress',
          ].includes(fieldName);
          const isCheckbox = [
            'isCallAvailableSource',
            'isWhatsAppAvailableSource',
            'isTelegramAvailableSource',
            'isCallAvailableDestination',
            'isWhatsAppAvailableDestination',
            'isTelegramAvailableDestination',
          ].includes(fieldName);

          if (index === steps[current].content.indexOf('Destination')) {
            return (
              <h4 key={index} style={{ marginBottom: '2rem', fontWeight: '700' }}>
                {t('addRequest.ForDestination')}:
              </h4>
            );
          } else if (index === steps[current].content.indexOf('Source')) {
            return (
              <h4 key={index} style={{ marginBottom: '2rem', fontWeight: '700' }}>
                {t('addRequest.ForSource')}:
              </h4>
            );
          }

          if (fieldName === 'sourceLocation') {
            return (
              <div
                key={index}
                style={
                  localStorage.getItem('movers&-lang') == 'en'
                    ? {
                        right: '0',
                        width: '50%',
                        float: 'right',
                        position: 'relative',
                        top: '-450px',
                      }
                    : {
                        left: '0',
                        width: '50%',
                        float: 'left',
                        position: 'relative',
                        top: '-450px',
                      }
                }
              >
                <div style={{ width: '100%', height: '400px' }}>
                  <GoogleMap
                    center={centerSource}
                    zoom={12}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onClick={(event) => handleMapClick(event, 'source')}
                  >
                    <Marker key="source" position={sourcePosition} />
                  </GoogleMap>
                </div>
              </div>
            );
          } else if (fieldName === 'destinationLocation') {
            return (
              <div
                key={index}
                style={
                  localStorage.getItem('movers&-lang') == 'en'
                    ? {
                        right: '0',
                        width: '50%',
                        float: 'right',
                        position: 'relative',
                        top: '-450px',
                      }
                    : {
                        left: '0',
                        width: '50%',
                        float: 'left',
                        position: 'relative',
                        top: '-450px',
                      }
                }
              >
                {/* <h4 style={{ marginBottom: '2rem', fontWeight: '700' }}>{t(`addRequest.DestinationLocation`)}:</h4> */}
                <div style={{ width: '100%', height: '400px' }}>
                  <GoogleMap
                    center={centerDestination}
                    zoom={12}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onClick={(event) => handleMapClick(event, 'destination')}
                  >
                    <Marker key="destination" position={destinationPosition} />
                  </GoogleMap>
                </div>
              </div>
            );
          }

          if (isCheckbox) {
            return (
              <Row
                key={index}
                style={
                  desktopOnly && localStorage.getItem('movers&-lang') == 'en'
                    ? { display: 'inline-block', width: '30%', marginRight: '3%', marginBottom: '5rem' }
                    : { display: 'inline-block', width: '30%', marginLeft: '3%', marginBottom: '5rem' }
                }
              >
                <Col key={index} style={{ width: '100%' }}>
                  <BaseForm.Item key={index} name={fieldName} valuePropName="checked">
                    <Checkbox>{label}</Checkbox>
                  </BaseForm.Item>
                </Col>
              </Row>
            );
          }
          if (isPhone) {
            return (
              <BaseButtonsForm.Item
                name={fieldName}
                key={index}
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
                <PhoneInput onChange={handleFormattedValueChange} country={'ae'} />
              </BaseButtonsForm.Item>
            );
          }
          if (isRadio) {
            return (
              <BaseForm.Item key={index} name={fieldName}>
                <Radio.Group
                  style={{ display: 'flex', width: '100%' }}
                  onChange={(event) => {
                    form.setFieldsValue({ [fieldName]: event.target.value });
                    setValueRadio(event.target.value);
                  }}
                >
                  <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    Internal
                  </Radio>
                  <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    External
                  </Radio>
                </Radio.Group>
              </BaseForm.Item>
            );
          }
          if (isTextArea) {
            return (
              <BaseForm.Item key={index} name={fieldName}>
                <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder="comment" />
              </BaseForm.Item>
            );
          }
          if (isInput) {
            return (
              <>
                <BaseForm.Item
                  key={index}
                  name={fieldName}
                  label={<LableText>{label}</LableText>}
                  rules={[
                    { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                  ]}
                  // style={{ width: '46%', margin: '0 2%', display: 'inline-block' }}
                  style={{ width: '40%', margin: '0 2%', display: 'inline-block' }}
                >
                  <Input />
                </BaseForm.Item>
              </>
            );
          }
          if (isSelectCountry) {
            return (
              <BaseForm.Item
                key={index}
                name={fieldName}
                label={<LableText>{t('addRequest.country')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={{ margin: '0 2% 2rem', width: '40%' }}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) => option!.children?.toLowerCase().includes(input?.toLowerCase())}
                  filterSort={(optionA: any, optionB: any) =>
                    optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                  }
                  onChange={(e) => ChangeCountryHandler(e, fieldName === 'sourceCountry' ? 'source' : 'destination')}
                >
                  {GetAllCountry?.data?.data?.result?.items?.map((ele: any) => {
                    return (
                      <Option value={ele.id} key={ele?.id}>
                        {ele.name}
                      </Option>
                    );
                  })}
                </Select>
              </BaseForm.Item>
            );
          }
          if (isSelectCity) {
            return (
              <BaseForm.Item
                key={index}
                name={fieldName}
                label={<LableText>{t('addRequest.city')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={{ margin: '0 2% 2rem', width: '40%' }}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) => option!.children?.toLowerCase().includes(input?.toLowerCase())}
                  filterSort={(optionA: any, optionB: any) =>
                    optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                  }
                  onChange={(e) => ChangeCityHandler(e, fieldName === 'sourceCity' ? 'source' : 'destination')}
                >
                  {cityData?.data?.result?.items?.map((ele: any) => {
                    return (
                      <Option value={ele.id} key={ele?.id}>
                        {ele.name}
                      </Option>
                    );
                  })}
                </Select>
              </BaseForm.Item>
            );
          }
          if (isSelectSourceType) {
            return (
              <BaseForm.Item
                key={index}
                name={fieldName}
                label={<LableText>{t('addRequest.sourceType')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={{ width: '50%', margin: 'auto' }}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  // filterOption={(input, option: any) => option!.children?.toLowerCase().includes(input?.toLowerCase())}
                  // filterSort={(optionA: any, optionB: any) =>
                  //   optionA!.children?.toLowerCase()?.localeCompare(optionB!.children?.toLowerCase())
                  // }
                  onChange={(e: any) => {
                    setSelectedSourceType(e);
                    setSourceType('1');
                  }}
                >
                  {GetAllSourceType?.data?.data?.result?.items?.map((ele: any) => {
                    return (
                      <Option value={ele.id} key={ele?.id}>
                        <Space>
                          <span role="img" aria-label={ele.name} style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={ele?.icon?.url} width={16} height={16} style={{ margin: '0 1.5rem 0 0.3rem' }} />
                            {ele.name}
                          </span>
                        </Space>
                      </Option>
                    );
                  })}
                </Select>
              </BaseForm.Item>
            );
          }
          if (isDatePicker) {
            return (
              <BaseForm.Item
                key={index}
                name={fieldName}
                label={<LableText>{t('addRequest.city')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={{ margin: '0 2% 6rem', width: '40%', marginBottom: '5rem' }}
              >
                <DatePicker style={{ width: '100%' }} />
              </BaseForm.Item>
            );
          }
          if (isTreeService && fieldName === 'services') {
            return (
              <BaseForm.Item key={index} name={fieldName}>
                {treeData?.map((serviceTreeData: any, serviceIndex: number) => {
                  const serviceKeys = selectedServicesKeysMap[serviceIndex] || [];
                  return (
                    <Tree
                      key={serviceIndex}
                      style={treeStyle}
                      checkable
                      defaultExpandAll
                      onExpand={onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onCheck={(checkedKeysValue: any) => {
                        console.log(checkedKeysValue);

                        for (const key of checkedKeysValue) {
                          console.log(key);

                          // if (key.includes('withTool') || key.includes('withSub')) {

                          if (!requestServicesArray.includes(key)) {
                            requestServicesArray.push(key);
                          }
                          // }
                          console.log(requestServicesArray);
                        }
                        // for (const key of checkedKeysValue) {
                        //   if (key.includes('withSub') || key.includes('withoutSub') || key.includes('withoutTool')) {
                        //     if (!requestServicesArray.includes(key)) {
                        //       requestServicesArray.push(key);
                        //     }
                        //   }
                        // }
                        setSelectedServicesKeysMap((prevSelectedKeysMap) => {
                          const updatedKeysMap = { ...prevSelectedKeysMap };
                          updatedKeysMap[serviceIndex] = checkedKeysValue;
                          return updatedKeysMap;
                        });
                      }}
                      defaultCheckedKeys={serviceKeys}
                      checkedKeys={serviceKeys}
                      onSelect={onSelect}
                      selectedKeys={selectedKeys}
                      treeData={[serviceTreeData]}
                    />
                  );
                })}
              </BaseForm.Item>
            );
          }
          if (isTreeSource) {
            return (
              <BaseForm.Item key={index} name={fieldName}>
                {sourceType == '0' ? (
                  <p>Please choose an option from the select.</p>
                ) : attributeForSourceTypesData?.data?.result?.items.length == 0 ? (
                  <p>This Source Type doesn&apos;t have any Attribute</p>
                ) : sourceType == '1' ? (
                  <Tree
                    key={index}
                    style={treeStyle}
                    checkable
                    defaultExpandAll
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={(checkedKeysValue: any) => {
                      const newSelectedSourceKeys: React.Key[] = [];
                      for (const key of checkedKeysValue) {
                        if (key.includes('sourceWithAttribute')) {
                          newSelectedSourceKeys.push(key);
                        }
                      }
                      setSelectedSourceKeys(newSelectedSourceKeys);
                      setCheckedKeys(checkedKeysValue);
                    }}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeDataSourceType}
                  />
                ) : (
                  ''
                )}
              </BaseForm.Item>
            );
          }
        })}

        <Row justify={'end'}>
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
            >
              Done
            </Button>
          )}
        </Row>
      </BaseForm>
    </Card>
  );
};
