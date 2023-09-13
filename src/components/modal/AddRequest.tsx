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
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { TextArea } from '../Admin/Translations';
import { useQuery } from 'react-query';
import { getServices } from '@app/services/services';
import { getChildAttributeChoice, getAttributeForSourceTypes, getSourceTypes } from '@app/services/sourceTypes';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { createRequest } from '@app/services/requests';
import { useMutation } from 'react-query';
import { Select, Option } from '../common/selects/Select/Select';
import { getCountries, getCities } from '@app/services/locations';
import { DatePicker } from '../common/pickers/DatePicker';
import { Alert } from '../common/Alert/Alert';
import { uploadAttachment } from '@app/services/Attachment';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const { Step } = Steps;
let requestServicesArray: any = [];
const requestServices: any = [];
const res: any = [];
const lang = localStorage.getItem('movers&-lang');

let requestData = {
  sourceCityId: '',
  sourceAddress: '',
  sourceLongitude: 0,
  sourceLatitude: 0,
  moveAtUtc: null,

  destinationCityId: '',
  destinationAddress: '',
  destinationLongitude: 0,
  destinationLatitude: 0,
  arrivalAtUtc: null,

  requestForQuotationContacts: [{}],
  serviceType: 0,
  comment: '',
  services: [],

  sourceTypeId: '',
  attributeForSourceTypeValues: [{}],
  attributeChoiceAndAttachments: [
    {
      attributeChoiceId: null,
      attachmentIds: [0],
    },
  ],
};

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
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [valueRadio, setValueRadio] = useState(1);
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState({ source: '0', destination: '0' });
  const [selectedServicesKeysMap, setSelectedServicesKeysMap] = useState<{ [index: number]: string[] }>({});
  const [selectedSourceType, setSelectedSourceType] = useState('0');
  const [sourceType, setSourceType] = useState('0');
  const [selectedChoices, setSelectedChoices] = useState<{ sourceTypeId: number; attributeChoiceId: number }[]>([]);
  const [attributeChoiceItems, setAttributeChoiceItems] = useState<JSX.Element[]>([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [attachmentIds, setAttachmentIds] = useState<number[]>([]);
  const [attachmentIdsChanged, setAttachmentIdsChanged] = useState(false);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const uploadImage = useMutation((data: any) => uploadAttachment(data), {
    onSuccess: (data: any) => {
      if (data.data.success) {
        setAttachmentIds((prevIds) => [...prevIds, data.data.result?.id]);
        setPreviewImage(data.data.result?.url);
      } else {
        message.open({
          content: <Alert message={data.data.error?.message || 'Upload failed'} type={'error'} showIcon />,
        });
      }
    },
    onError: (error: any) => {
      message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
    },
  });

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
    isRefetching: attributeForSourceTypesIsRefetching,
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
      key: `service${service?.id}`,
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
          key: subService?.tools?.length > 0 ? `` : `onlySub service${service?.id} sub${subService?.id}`,
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
    const dialCode = fullPhoneNumber?.substring(0, fullPhoneNumber.indexOf('+') + 4);
    const phoneNumber = fullPhoneNumber?.substring(dialCode.length);
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
            content: <Alert message={t('requests.addRequestSuccessMessage')} type={`success`} showIcon />,
          });
        requestServicesArray = [];
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
        requestServicesArray = [];
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
      dailCode: '+' + dialCodeS,
      phoneNumber: phoneNumberS,
      firstNameContact: form.getFieldValue('firstNameContactSource'),
      lastNameContact: form.getFieldValue('lastNameContactSource'),
      isCallAvailable: form.getFieldValue('isCallAvailableSource') == undefined ? false : true,
      isWhatsAppAvailable: form.getFieldValue('isWhatsAppAvailableSource') == undefined ? false : true,
      isTelegramAvailable: form.getFieldValue('isTelegramAvailableSource') == undefined ? false : true,
      requestForQuotationContactType: 1,
    };
    const destinationContact = {
      dailCode: '+' + dialCodeD,
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
          requestServices.push(result);
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          requestServices.push(result);
        }
        return result;
      });
    }
    extractServicesIds(requestServicesArray);

    const selectedChoicesArray = Object.entries(selectedChoices);

    const attributeForSourceTypeValues = selectedChoicesArray.map(([sourceTypeId, choice]: any) => {
      const sourceTypeIdNumber = parseInt(sourceTypeId);
      const parts = choice.split(' ');
      const attributeChoiceId = parseInt(parts[2].replace('parentAttributeChoice', ''));
      return {
        attributeForSourcTypeId: sourceTypeIdNumber,
        attributeChoiceId: attributeChoiceId,
      };
    });

    const formDataArray = fileList.map((file: any) => {
      const formData = new FormData();
      formData.append('RefType', '2');
      formData.append('file', file.originFileObj);
      return formData;
    });

    const uploadPromises = formDataArray.map((formData: any) => {
      return uploadImage.mutateAsync(formData);
    });

    Promise.all(uploadPromises)
      .then(() => {
        setAttachmentIdsChanged(true);
      })
      .catch((error) => {
        console.error('File upload error:', error);
      });

    requestData = {
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
      attributeForSourceTypeValues,
      attributeChoiceAndAttachments: [
        {
          attributeChoiceId: null,
          attachmentIds: attachmentIds,
        },
      ],
    };
  };

  useEffect(() => {
    if (attachmentIdsChanged) {
      requestData.attributeChoiceAndAttachments[0].attachmentIds = attachmentIds;
      createRequestMutation.mutateAsync(requestData);
      setAttachmentIdsChanged(false);
    }
  }, [attachmentIdsChanged]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Card title={t('addRequest.addRequest')} padding="1.25rem 1.25rem 1.25rem">
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
            onClick={onFinish}
            loading={createRequestMutation.isLoading || uploadImage.isLoading}
          >
            {t('common.done')}
          </Button>
        )}
      </Row>
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
          const isSource = fieldName === 'attributeForSourceTypeValues';
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
              <h4 key={index} style={{ margin: '5rem 0 2rem', fontWeight: '700' }}>
                {t('addRequest.ForDestination')}:
              </h4>
            );
          } else if (index === steps[current].content.indexOf('Source')) {
            return (
              <h4 key={index} style={{ margin: '2rem 0', fontWeight: '700' }}>
                {t('addRequest.ForSource')}:
              </h4>
            );
          }
          if (fieldName === 'sourceLocation') {
            return (
              <div
                key={index}
                style={
                  lang == 'en' && (isDesktop || isTablet)
                    ? { right: '0', float: 'right', position: 'relative', width: '50%', top: '-450px' }
                    : lang == 'en' && isMobile
                    ? { right: '0', float: 'right', position: 'relative', width: '100%', marginBottom: '4rem' }
                    : lang == 'ar' && (isDesktop || isTablet)
                    ? { left: '0', float: 'left', position: 'relative', width: '50%', top: '-450px' }
                    : lang == 'ar' && isMobile
                    ? { left: '0', float: 'left', position: 'relative', width: '100%', marginBottom: '4rem' }
                    : {}
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
                  lang == 'en' && (isDesktop || isTablet)
                    ? { right: '0', float: 'right', position: 'relative', width: '50%', top: '-450px' }
                    : lang == 'en' && isMobile
                    ? { right: '0', float: 'right', position: 'relative', width: '100%' }
                    : lang == 'ar' && (isDesktop || isTablet)
                    ? { left: '0', float: 'left', position: 'relative', width: '50%', top: '-450px' }
                    : lang == 'ar' && isMobile
                    ? { left: '0', float: 'left', position: 'relative', width: '100%' }
                    : {}
                }
              >
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
                  lang == 'en' && (isDesktop || isTablet)
                    ? { display: 'inline-block', width: '30%', marginRight: '3%', marginBottom: '2rem' }
                    : lang == 'en' && isMobile
                    ? { display: 'block', width: '100%', margin: '1rem' }
                    : lang == 'ar' && (isDesktop || isTablet)
                    ? { display: 'inline-block', width: '30%', marginLeft: '3%', marginBottom: '2rem' }
                    : lang == 'ar' && isMobile
                    ? { display: 'block', width: '100%', margin: '1rem' }
                    : {}
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
                <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
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
                  style={
                    isDesktop || isTablet
                      ? { width: '40%', margin: '0 2%', display: 'inline-block' }
                      : isMobile
                      ? { width: '100%', display: 'block' }
                      : {}
                  }
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
                style={
                  isDesktop || isTablet ? { margin: '0 2% 2rem', width: '40%' } : isMobile ? { width: '100%' } : {}
                }
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
                style={
                  isDesktop || isTablet ? { margin: '0 2% 2rem', width: '40%' } : isMobile ? { width: '100%' } : {}
                }
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
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : isMobile ? { width: '100%' } : {}}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
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
                label={<LableText>{t('addRequest.date')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={
                  isDesktop || isTablet
                    ? { margin: '0 2% 6rem', width: '40%', marginBottom: '5rem' }
                    : isMobile
                    ? { width: '100%', marginBottom: '5rem' }
                    : {}
                }
              >
                <DatePicker style={{ width: '100%' }} />
              </BaseForm.Item>
            );
          }
          if (isTreeService) {
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
                        for (const key of checkedKeysValue) {
                          if (!requestServicesArray.includes(key)) {
                            requestServicesArray.push(key);
                          }
                        }
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
          if (isSource) {
            return (
              <BaseForm.Item key={index} name={fieldName}>
                {sourceType == '0' ? (
                  <p>Please choose an option from the select.</p>
                ) : attributeForSourceTypesData?.data?.result?.items.length == 0 ? (
                  <p>This Source Type doesn&apos;t have any Attribute</p>
                ) : attributeForSourceTypesData?.data?.result?.items.length > 0 && sourceType == '1' ? (
                  <div>
                    {attributeForSourceTypesData?.data?.result?.items.map((sourceTypeItem: any) => (
                      <Card key={sourceTypeItem.id} style={{ margin: '3rem 0' }}>
                        <div style={{ margin: '1rem' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '3rem' }}>{sourceTypeItem.name}</p>
                          <Radio.Group
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                            onChange={(e) => {
                              const sourceTypeId = sourceTypeItem.id;
                              const parentAttributeChoiceId = parseInt(
                                e.target.value.split(' ')[2].replace('parentAttributeChoice', ''),
                              );
                              setSelectedChoices((prevSelectedChoices) => ({
                                ...prevSelectedChoices,
                                [sourceTypeId]: e.target.value,
                              }));

                              getChildAttributeChoice(parentAttributeChoiceId)
                                .then((data) => {
                                  const items = data?.data?.result?.items || [];

                                  const itemElements = items.map((item: any) => (
                                    <div key={item.id} style={{ margin: '4rem 1rem 5rem' }}>
                                      <p>{item.name}</p>
                                    </div>
                                  ));

                                  setAttributeChoiceItems((prevAttributeChoiceItems) => ({
                                    ...prevAttributeChoiceItems,
                                    [sourceTypeId]: itemElements,
                                  }));
                                })
                                .catch((error) => {
                                  console.error(error);
                                });
                            }}
                            value={selectedChoices[sourceTypeItem.id]}
                          >
                            {sourceTypeItem.attributeChoices.map((parentAttributeChoice: any) => (
                              <Radio
                                key={parentAttributeChoice.id}
                                value={`sourceWithAttribute attributeForSourceType${sourceTypeItem.id} parentAttributeChoice${parentAttributeChoice.id}`}
                              >
                                {parentAttributeChoice.name}
                              </Radio>
                            ))}
                          </Radio.Group>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {attributeChoiceItems[sourceTypeItem.id]}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".jpeg,.png,.jpg"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                ) : (
                  ''
                )}
              </BaseForm.Item>
            );
          }
        })}
      </BaseForm>
    </Card>
  );
};
