import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { message, Steps, Radio, Image, Row, Col, Space, Tree, Tag, DatePicker } from 'antd';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Card } from '@app/components/common/Card/Card';
import { CreateButtonText, treeStyle, LableText, TextBack } from '../GeneralStyles';
import { Input } from '../Admin/Translations';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import _ from 'lodash';
import { ClearOutlined, HomeOutlined, LeftOutlined, PushpinOutlined, UserOutlined } from '@ant-design/icons';
import { useResponsive } from '@app/hooks/useResponsive';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { TextArea } from '../Admin/Translations';
import { useQuery } from 'react-query';
import { getServices } from '@app/services/services';
import { getChildAttributeChoice, getAttributeForSourceTypes } from '@app/services/sourceTypes';
import { UpdateRequest, getRequestById } from '@app/services/requests';
import { useMutation } from 'react-query';
import { Select, Option } from '../common/selects/Select/Select';
import { getCountries, getCities } from '@app/services/locations';
import { Alert } from '../common/Alert/Alert';
import { uploadAttachment, UploadMultiAttachment } from '@app/services/Attachment';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Button as Btn } from '@app/components/common/buttons/Button/Button';
import { useLanguage } from '@app/hooks/useLanguage';
import { notificationController } from '@app/controllers/notificationController';
import { RequestModel } from '@app/interfaces/interfaces';
import UploadImageRequest, { IUploadImage } from './upload-image';
import moment from 'moment';
import { validationInputNumber } from '../functions/ValidateInputNumber';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const steps = [
  {
    title: 'SourceType',
  },
  {
    title: 'Attachment',
  },
  {
    title: 'Location',
  },
  {
    title: 'Contact',
  },
  {
    title: 'Services',
  },
];

const { Step } = Steps;
let requestData = {};
let requestServicesArray: any = [];
let requestServices: any = [];
const lang = localStorage.getItem('Go Movaro-lang');
const sourceLat = 25.15658048160557;
const sourceLng = 55.34100848084654;
const destinationLat = 25.180801685212185;
const destinationLng = 55.281956967174665;

export const EditRequest: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { desktopOnly, isTablet, isMobile, isDesktop } = useResponsive();
  const { requestId } = useParams();
  const { language } = useLanguage();
  const Navigate = useNavigate();

  const [RequestData, setRequestData] = useState<RequestModel>();
  const [getRequest, setGetRequest] = useState<boolean>(true);
  const [current, setCurrent] = useState(0);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [sourcePosition, setSourcePosition] = useState({
    lat: sourceLat,
    lng: sourceLng,
  });
  const [destinationPosition, setDestinationPosition] = useState({ lat: destinationLat, lng: destinationLng });
  const [centerSource, setCenterSource] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  const [centerDestination, setCenterDestination] = useState({
    lat: 25.15658048160557,
    lng: 55.34100848084654,
  });
  // tree state (services)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [defaultCheckedServices, setDefaultCheckedServices] = useState<any[]>([]);
  // service type state
  const [valueRadio, setValueRadio] = useState(0);
  // location state
  const [countryId, setCountryId] = useState<string>('0');
  const [cityId, setCityId] = useState({ source: '0', destination: '0' });
  // select attributeChoice state
  const [selectedRadio, setSelectedRadio] = useState<
    Array<{ attributeForSourcTypeId: number; attributeChoiceId: number }>
  >([]);
  // images state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [attributeChoiceAndAttachments, setAttributeChoiceAndAttachments] = useState<
    Array<{ attributeChoiceId: number; attachmentIds: number[] }>
  >([]);
  // multiple attachment in request level state
  const [fileListLength, setFileListLength] = useState(0);
  const [picturesList, setPicturesList] = useState<any[]>([]);

  const [validations, setValidations] = useState<boolean>(false);
  const [childAttributeChoices, setChildAttributeChoices] = useState<any>();

  const {
    data: dataRequest,
    status,
    refetch: refetchRequest,
    isRefetching: isRefetchingRequest,
    isLoading,
  } = useQuery(
    ['GetRequestById'],
    () =>
      getRequestById(requestId)
        .then((data) => {
          const result = data.data?.result;
          const imageRequest = data.data?.result.attributeChoiceAndAttachments.map((item: any) => {
            return {
              attachmentIds: item.attachments.map((attachment: any) => attachment.id),
              attributeChoiceId: item.attributeChoice.id,
            };
          });
          setSelectedRadio(
            data.data?.result.attributeForSourceTypeValues.map((item: any) => {
              return {
                attributeForSourcTypeId: item.attributeForSourcType.id,
                attributeChoiceId: item.attributeChoice.id,
              };
            }),
          );
          setAttributeChoiceAndAttachments(imageRequest ?? []);
          setRequestData(result);
          setGetRequest(false);
        })
        .catch((error) => {
          notificationController.error({ message: error.message || error.error?.message });
        }),
    {
      enabled: getRequest,
    },
  );

  const GetAllServices = useQuery('getAllServices', getServices);
  const GetAllCountry = useQuery('GetAllCountry', getCountries);
  const {
    data: cityData,
    refetch,
    isRefetching,
  } = useQuery('GetAllCity', () => getCities(countryId), {
    enabled: countryId != '0',
  });

  const {
    data: attributeForSourceTypesData,
    refetch: attributeForSourceTypesRefetch,
    isRefetching: attributeForSourceTypesIsRefetching,
    isLoading: attributeForSourceTypesIsLoading,
  } = useQuery('AttributeForSourceType', () => getAttributeForSourceTypes(RequestData?.sourceType?.id ?? '0'), {
    enabled: RequestData?.sourceType?.id != undefined,
  });

  useEffect(() => {
    if (selectedRadio?.length > 0) {
      selectedRadio.map((item) => {
        getChildAttributeChoice(item.attributeChoiceId)
          .then((data) => {
            const items = data?.data?.result?.items || [];
            setChildAttributeChoices(items);
          })
          .catch((error) => {
            message.open(error);
          });
        return item;
      });
    }
  }, [selectedRadio]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreviews = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const uploadImage = useMutation((data: any) => uploadAttachment(data), {
    // onSuccess: (data: any) => {
    //   if (data.data.success) {
    //     const newId = data.data.result?.id;
    //     setPreviewImage(data.data.result?.url);
    //     setAttributeChoiceAndAttachments((prevAttributes) => {
    //       const existingObjectIndex = prevAttributes.findIndex((obj) => obj.attributeChoiceId === itemId);
    //       if (existingObjectIndex !== -1) {
    //         const updatedAttributes = [...prevAttributes];
    //         const attachmentIds = updatedAttributes[existingObjectIndex].attachmentIds;
    //         if (!attachmentIds.includes(newId)) {
    //           attachmentIds.push(newId);
    //         }
    //         return updatedAttributes;
    //       } else {
    //         return [
    //           ...prevAttributes,
    //           {
    //             attributeChoiceId: itemId,
    //             attachmentIds: [newId],
    //           },
    //         ];
    //       }
    //     });
    //   } else {
    //     message.open({
    //       content: <Alert message={data.data.error?.message || 'Upload failed'} type={'error'} showIcon />,
    //     });
    //   }
    // },
    // onError: (error: any) => {
    //   message.open({ content: <Alert message={error.error?.message || error.message} type={'error'} showIcon /> });
    // },
  });

  useEffect(() => {
    if (countryId != '0') refetch();
  }, [countryId]);

  useEffect(() => {
    attributeForSourceTypesRefetch();
    GetAllServices.refetch();
  }, [language, RequestData?.sourceType?.id]);

  useEffect(() => {
    setSourcePosition({
      lat: RequestData?.sourceLatitude,
      lng: RequestData?.sourceLongitude,
    });
    setDestinationPosition({
      lat: RequestData?.destinationLatitude,
      lng: RequestData?.destinationLongitude,
    });

    const requestDataAttachments = RequestData?.attachments || [];
    const transformedAttachments = requestDataAttachments.map((attachment: any) => ({
      status: 'done',
      uid: attachment.id,
      url: attachment.url || attachment.lowResolutionPhotoUrl,
    }));
    setFileList(transformedAttachments);

    const attributeAndAttachments = RequestData?.attributeChoiceAndAttachments || [];
    const transformedAttributeAttachments = attributeAndAttachments.map((attribute: any) => {
      return {
        attributeId: attribute.attributeChoice.id,
        attachment: attribute.attachments.map((attachment: any) => ({
          status: 'done',
          uid: attachment.id,
          url: attachment.url || attachment.lowResolutionPhotoUrl,
          name: attachment.url ?? '',
        })),
      };
    });
    // setImagesList(transformedAttributeAttachments);
  }, [RequestData]);

  const filterImage = (attributeId: number) => {
    const attributeAndAttachments = RequestData?.attributeChoiceAndAttachments || [];
    let imagesData: Array<any> = [];
    attributeAndAttachments.map((attribute: any) => {
      if (attribute.attributeChoice.id === attributeId) {
        const temp = attribute.attachments.map((attachment: any) => ({
          attributeId: attributeId,
          id: attachment.id,
          url: attachment.url || attachment.lowResolutionPhotoUrl,
        }));
        imagesData = temp;
      }
    });
    return imagesData;
  };

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

  const treeData: any = GetAllServices?.data?.data?.result?.items?.map((service: any) => {
    return {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
          <Image src={service?.attachment?.url} width={16} height={16} />
          <span style={{ fontWeight: 'bold' }}>
            {service?.id}
            {service?.name}
          </span>
        </span>
      ),
      key: `service${service?.id}`,
      serviceId: `${service?.id}`,
      children:
        service?.subServices?.length > 0
          ? service?.subServices?.map((subService: any) => {
              return {
                title: (
                  <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                    <Image src={service?.attachment?.url} width={16} height={16} />
                    <span style={{ fontWeight: 'bold' }}>
                      {subService?.id}
                      {subService?.name}
                    </span>
                  </span>
                ),
                key:
                  subService?.tools?.length > 0
                    ? `sub${subService?.id}`
                    : `onlySub service${service?.id} sub${subService?.id}`,
                serviceId: `${service?.id}`,
                subServiceId: `${subService?.id}`,
                children:
                  subService?.tools?.length > 0
                    ? subService?.tools?.map((tool: any) => {
                        return {
                          title: (
                            <span style={{ display: 'flex', alignItems: 'center', margin: '0.7rem 0' }}>
                              <Image src={tool?.attachment?.url} width={16} height={16} />
                              <span style={{ fontWeight: 'bold' }}>
                                {tool?.id}
                                {tool?.name}
                              </span>
                            </span>
                          ),
                          key: `withTool service${service?.id} sub${subService?.id} tool${tool?.id}`,
                          serviceId: `${service?.id}`,
                          subServiceId: `${subService?.id}`,
                          toolId: `${tool?.id}`,
                        };
                      })
                    : [],
                disabled: service?.subServices?.length > 0 ? false : true,
              };
            })
          : [],
      disabled: service?.subServices?.length > 0 ? false : true,
    };
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

  const ChangeCountryHandler = (e: any, positionType: 'source' | 'destination') => {
    setCountryId(e);
    if (positionType === 'source') {
      form.setFieldValue('sourceCityId', '');
    } else if (positionType === 'destination') {
      form.setFieldValue('destinationCityId', '');
    }
  };

  const ChangeCityHandler = (e: any, positionType: 'source' | 'destination') => {
    if (positionType === 'source') {
      setCityId((prevCityId) => ({ ...prevCityId, source: e }));
    } else if (positionType === 'destination') {
      setCityId((prevCityId) => ({ ...prevCityId, destination: e }));
    }
  };

  const updateRequestMutation = useMutation((id: any) =>
    UpdateRequest(id)
      .then((data) => {
        data.data?.success &&
          message.open({
            content: <Alert message={t('requests.addRequestSuccessMessage')} type={`success`} showIcon />,
          });
        requestServicesArray = [];
        setAttributeChoiceAndAttachments([]);
        Navigate(`/requests`);
      })
      .catch((error) => {
        message.open({
          content: <Alert message={error.message || error.error?.message} type={`error`} showIcon />,
        });
        requestServicesArray = [];
      }),
  );

  const onFinish = async (values: any) => {
    const sourceContact = {
      dailCode: '+971',
      phoneNumber: form.getFieldValue(['requestForQuotationContacts', 0, 'phoneNumber']),
      fullName:
        form.getFieldValue(['requestForQuotationContacts', 0, 'fullName']) == undefined
          ? RequestData?.requestForQuotationContacts[0]?.fullName
          : form.getFieldValue(['requestForQuotationContacts', 0, 'fullName']),
      requestForQuotationContactType: 1,
    };
    const destinationContact = {
      dailCode: '+971',
      phoneNumber: form.getFieldValue(['requestForQuotationContacts', 1, 'phoneNumber']),
      fullName:
        form.getFieldValue(['requestForQuotationContacts', 1, 'fullName']) == undefined
          ? RequestData?.requestForQuotationContacts[1]?.fullName
          : form.getFieldValue(['requestForQuotationContacts', 1, 'fullName']),
      requestForQuotationContactType: 2,
    };

    // services
    function extractServicesIds(input: any) {
      // requestServices = [];
      input.map((obj: any) => {
        const parts = obj.split(' ');
        let result = {};
        if (parts[0] == 'withTool') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: parseInt(parts[3].replace('tool', '')),
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        } else if (parts[0] == 'onlySub') {
          result = {
            serviceId: parseInt(parts[1].replace('service', '')),
            subServiceId: parseInt(parts[2].replace('sub', '')),
            toolId: null,
          };
          if (!requestServices.includes(result)) {
            requestServices.push(result);
          }
        }
        return result;
      });
    }
    // console.log('attributeChoiceAndAttachments', attributeChoiceAndAttachments);
    // console.log('fileList', fileList);

    extractServicesIds(requestServices.length == 0 ? defaultCheckedServices : requestServicesArray);

    // attributeChoiceAndAttachments
    const attachmentIds = fileList.map((file) => file.uid);
    const y = [
      {
        attributeChoiceId: null,
        attachmentIds: attachmentIds,
      },
    ];
    const allAttachments = [...y, ...attributeChoiceAndAttachments];

    console.log('requestServices', requestServices);
    requestData = {
      sourceTypeId: RequestData?.sourceType?.id,
      requestForQuotationContacts: [sourceContact, destinationContact],
      serviceType: valueRadio == 0 ? RequestData?.serviceType : valueRadio,
      // moveAtUtc:
      //   form.getFieldValue('moveAtUtc') == undefined
      //     ? RequestData?.moveAtUtc
      //     : form.getFieldValue('moveAtUtc').format('YYYY-MM-DDTHH:mm:ss'),
      sourceCityId: cityId.source == '0' ? RequestData?.sourceCity.id : cityId.source,
      sourceAddress:
        form.getFieldValue('sourceAddress') == undefined
          ? RequestData?.sourceAddress
          : form.getFieldValue('sourceAddress'),
      // arrivalAtUtc:
      //   form.getFieldValue('arrivalAtUtc') == undefined
      //     ? RequestData?.arrivalAtUtc
      //     : form.getFieldValue('arrivalAtUtc').format('YYYY-MM-DDTHH:mm:ss'),
      destinationCityId: cityId.destination == '0' ? RequestData?.destinationCity.id : cityId.destination,
      destinationAddress:
        form.getFieldValue('destinationAddress') == undefined
          ? RequestData?.destinationAddress
          : form.getFieldValue('destinationAddress'),
      sourceLongitude: sourcePosition.lng,
      sourceLatitude: sourcePosition.lat,
      destinationLongitude: destinationPosition.lng,
      destinationLatitude: destinationPosition.lat,
      services: requestServices,

      comment: form.getFieldValue('comment'),
      attributeForSourceTypeValues: selectedRadio,
      attributeChoiceAndAttachments: allAttachments,
      userId: RequestData?.user.id,
      id: requestId,
    };
    setValidations(true);
    console.log(requestData);
  };

  // console.log('validations', validations);
  useEffect(() => {
    if (validations) {
      const showError = (messageText: string) => {
        message.open({
          content: <Alert message={messageText} type={`error`} showIcon />,
        });
        setValidations(false);
      };

      const checkField = (fieldName: any, messageText: string) => {
        if (form.getFieldValue(fieldName) === undefined) {
          showError(messageText);
          return false;
        }
        return true;
      };

      console.log('requestServices', requestServices);
      // console.log('defaultCheckedServices', defaultCheckedServices);
      if (requestServices.length === 0 && defaultCheckedServices.length === 0) {
        showError(t('requests.atLeastOneService'));
      } else if (attributeChoiceAndAttachments.length === 0 || fileList.length === 0) {
        showError(t('addRequest.atLeastOneAttachment'));
        // } else if (valueRadio === 0) {
        // showError(t('addRequest.selectServiceType'));
      } else if (
        !checkField(['requestForQuotationContacts', 0, 'phoneNumber'], t('addRequest.enterPhoneNumber')) ||
        !checkField(['requestForQuotationContacts', 1, 'phoneNumber'], t('addRequest.enterPhoneNumber')) ||
        !checkField(['requestForQuotationContacts', 0, 'fullName'], t('addRequest.enterFullName')) ||
        !checkField(['requestForQuotationContacts', 1, 'fullName'], t('addRequest.enterFullName')) ||
        !checkField('sourceAddress', t('addRequest.enterAddress')) ||
        !checkField('destinationAddress', t('addRequest.enterAddress'))
      ) {
        return;
        // } else if (cityId.source === '0' || cityId.destination === '0') {
        //   showError(t('addRequest.enterCity'));
      } else {
        updateRequestMutation.mutateAsync(requestData);
        requestServices = [];
        requestServicesArray = [];
        // setValidations(false);
      }
      // setValidations(true);
    }
  }, [validations]);

  // console.log('requestServices', requestServices);
  // console.log('defaultCheckedServices', defaultCheckedServices);

  const uploadButtonForAllRequest = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const UploadAttachments = async (options: any) => {
    const { file } = options;

    if (typeof file?.uid === 'string') picturesList?.push(file);

    if (picturesList?.length === fileListLength) {
      const formData = new FormData();
      picturesList?.forEach((item) => {
        formData.append('files', item);
      });
      formData.append('RefType', '2');
      const result = await UploadMultiAttachment(formData);
      const x: any[] = [];
      result?.data?.result?.map((res: any) => {
        x.push({
          uid: res?.id,
          status: 'done',
          url: res?.url,
        });
      });
      setPicturesList([]);
      setFileListLength(0);

      setFileList(fileList.concat(x));
    }
  };

  useEffect(() => {
    const updateFormValues = async () => {
      const checkedKeysById: any[] = [];
      RequestData?.services?.map((service: any) => {
        service.subServices?.map((subService: any) => {
          if (subService?.tools?.length === 0) {
            checkedKeysById.push(`onlySub service${service?.id} sub${subService?.id}`);
          } else
            subService.tools.map((tool: any) => {
              checkedKeysById.push(`withTool service${service?.id} sub${subService?.id} tool${tool?.id}`);
            });
        });
      });
      setDefaultCheckedServices(checkedKeysById);
      await form.setFieldsValue(RequestData);
    };
    updateFormValues();
  }, [RequestData, form]);

  useEffect(() => {
    attributeForSourceTypesData?.data?.result?.items.map((sourceTypeItem: any) => {
      sourceTypeItem.attributeChoices.map((parentAttributeChoice: any) => {
        if (
          RequestData?.attributeForSourceTypeValues.find(
            (value: any) => value?.attributeForSourcType?.id === sourceTypeItem.id,
          )?.attributeChoice.id === parentAttributeChoice.id
        ) {
          // setMaher((prev) => {
          //   return prev.concat([
          //     {
          //       parentId: sourceTypeItem.id,
          //       childId: parentAttributeChoice.id,
          //       isChange: true,
          //     },
          //   ]);
          // });
        }
      });
    });
  }, [attributeForSourceTypesData, RequestData]);

  const addImageToState = (data: any) => {
    const tempAttribute = _.cloneDeep(attributeChoiceAndAttachments);
    const findAttribute = tempAttribute.findIndex((item) => item.attributeChoiceId === data.attributeId);
    if (findAttribute !== -1) {
      tempAttribute[findAttribute].attachmentIds.push(data.id);
    } else {
      tempAttribute.push({
        attachmentIds: [data.id],
        attributeChoiceId: data.attributeId,
      });
    }
    setAttributeChoiceAndAttachments(tempAttribute);
  };

  const uploadImageAction = (
    file: any,
    url: Array<IUploadImage>,
    setUrl: Dispatch<SetStateAction<Array<IUploadImage>>>,
    attributeId: number,
  ) => {
    const tempImage = _.cloneDeep(url);
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('RefType', '2');
    uploadImage.mutate(formData, {
      onSuccess(data) {
        if (data.data.success) {
          tempImage.push({
            id: data.data.result.id,
            attributeId: attributeId,
            url: data.data.result.url,
            status: 'done',
          });
          addImageToState({
            id: data.data.result.id,
            attributeId: attributeId,
            url: data.data.result.url,
          });
          setUrl(tempImage);
        }
      },
    });
  };

  const handleDeleteImage = (
    attributeId: number,
    imageId: number,
    url: Array<IUploadImage>,
    setUrl: Dispatch<SetStateAction<Array<IUploadImage>>>,
  ) => {
    const tempAttachment = _.cloneDeep(attributeChoiceAndAttachments);
    const tempUrl = _.cloneDeep(url);

    const attributeIndex = tempAttachment.findIndex((item) => item.attributeChoiceId === attributeId);
    if (attributeIndex !== -1) {
      const newAttachments = tempAttachment[attributeIndex].attachmentIds.filter((item) => item !== imageId);
      tempAttachment[attributeIndex].attachmentIds = newAttachments;
      const filteredUrl = tempUrl.filter((item) => item.id !== imageId);
      setUrl(filteredUrl);
      setAttributeChoiceAndAttachments(tempAttachment);
    }
  };

  return (
    <Card title={t('requests.editRequest')} padding="1.25rem 1.25rem 1.25rem">
      <Row justify={'end'} style={{ width: '100%' }}>
        <Btn
          style={{
            margin: '1rem 1rem 1rem 0',
            width: 'auto',
            height: 'auto',
          }}
          type="ghost"
          onClick={() => Navigate(-1)}
          icon={<LeftOutlined />}
        >
          <TextBack style={{ fontWeight: desktopOnly ? FONT_WEIGHT.medium : '' }}>{t('common.back')}</TextBack>
        </Btn>

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
            onClick={onFinish}
            loading={updateRequestMutation.isLoading || uploadImage.isLoading}
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
                <HomeOutlined />
              ) : index === 1 ? (
                <PushpinOutlined />
              ) : 2 ? (
                <PushpinOutlined />
              ) : index === 3 ? (
                <UserOutlined />
              ) : index === 4 ? (
                <ClearOutlined />
              ) : undefined
            }
          />
        ))}
      </Steps>

      {status === 'success' && RequestData && (
        <BaseForm
          form={form}
          onFinish={onFinish}
          name="editRequestForm"
          style={{ padding: '10px 20px', width: '90%', margin: 'auto' }}
        >
          {current === 0 && (
            <>
              <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.whatMoving')}</h4>
              <BaseForm.Item name={['attributeForSourceTypeValues']}>
                {attributeForSourceTypesData?.data?.result?.items.length == 0 ? (
                  <p>{t('addRequest.sourceTypeDoesntHaveAttribute')}</p>
                ) : attributeForSourceTypesData?.data?.result?.items.length > 0 ? (
                  <div>
                    {attributeForSourceTypesData?.data?.result?.items.map((sourceTypeItem: any) => (
                      <Card key={sourceTypeItem.id} style={{ margin: '3rem 0' }}>
                        <div>
                          <h3 style={{ margin: '1rem' }}>{sourceTypeItem.name}</h3>
                          <Radio.Group
                            className="radios"
                            style={{ display: 'flex', justifyContent: 'space-around', margin: '1rem' }}
                            onChange={(e) => {
                              setSelectedRadio((prevSelectedChoices) => {
                                const existingIndex = prevSelectedChoices.findIndex(
                                  (choice) => choice.attributeForSourcTypeId === sourceTypeItem.id,
                                );
                                if (existingIndex !== -1) {
                                  return [
                                    ...prevSelectedChoices.slice(0, existingIndex),
                                    {
                                      attributeForSourcTypeId: sourceTypeItem.id,
                                      attributeChoiceId: e.target.value,
                                    },
                                    ...prevSelectedChoices.slice(existingIndex + 1),
                                  ];
                                } else {
                                  return [
                                    ...prevSelectedChoices,
                                    {
                                      attributeForSourcTypeId: sourceTypeItem.id,
                                      attributeChoiceId: e.target.value,
                                    },
                                  ];
                                }
                              });
                            }}
                            defaultValue={
                              selectedRadio.length > 0
                                ? selectedRadio.find(
                                    (value: any) => value?.attributeForSourcTypeId === sourceTypeItem.id,
                                  )?.attributeChoiceId
                                : undefined
                            }
                          >
                            {sourceTypeItem.attributeChoices.map((parentAttributeChoice: any) => (
                              <Radio
                                key={parentAttributeChoice.id}
                                value={parentAttributeChoice.id}
                                style={{ height: '30px', margin: '.5rem' }}
                              >
                                {parentAttributeChoice.name}
                              </Radio>
                            ))}
                          </Radio.Group>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </BaseForm.Item>
            </>
          )}

          {current === 1 && (
            <Row className="fullContent" justify={'center'}>
              {childAttributeChoices.map((item: any) => {
                return (
                  <Col key={item.id} span={12}>
                    <UploadImageRequest
                      item={item}
                      uploadImageAction={uploadImageAction}
                      images={filterImage(item.id)}
                      handleDeleteImage={handleDeleteImage}
                      previewOpen={previewOpen}
                      previewTitle={previewTitle}
                      handleCancel={handleCancel}
                      previewImage={previewImage}
                      handlePreviews={handlePreviews}
                    />
                  </Col>
                );
              })}
              <Row>
                <p> add additional attachments for your request: </p>
                <Upload
                  accept=".jpeg,.png,.jpg"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreviews}
                  maxCount={10}
                  multiple
                  onChange={(item) => {
                    setFileListLength(item.fileList?.filter((item) => typeof item.uid === 'string')?.length);
                  }}
                  onRemove={(file) => {
                    setFileList((prev: any[]) => {
                      const data = prev.filter((item: any) => item?.uid !== file?.uid);
                      return data;
                    });
                    return;
                  }}
                  customRequest={UploadAttachments}
                >
                  {fileList.length >= 8 ? null : uploadButtonForAllRequest}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Row>
            </Row>
          )}

          {current === 2 && (
            <>
              <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.typeMove')}:</h4>
              <BaseForm.Item
                name={['serviceType']}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
              >
                <Radio.Group
                  style={{ display: 'flex', width: '100%' }}
                  onChange={(event) => {
                    form.setFieldsValue({ ['serviceType']: event.target.value });
                    setValueRadio(event.target.value);
                  }}
                  defaultValue={RequestData.serviceType}
                >
                  <Radio value={1} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    {t('requests.Internal')}
                  </Radio>
                  <Radio value={2} style={{ width: '46%', margin: '2%', display: 'flex', justifyContent: 'center' }}>
                    {t('requests.External')}
                  </Radio>
                </Radio.Group>
              </BaseForm.Item>

              <h4 style={{ margin: '4rem 0', fontWeight: '700' }}>{t('addRequest.sourceLocations')}:</h4>
              <BaseForm.Item
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
                  onChange={(e) => ChangeCountryHandler(e, 'source')}
                  defaultValue={RequestData.sourceCity.country.name}
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
              <BaseForm.Item
                name={['sourceCityId']}
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
                  onChange={(e) => ChangeCityHandler(e, 'source')}
                  defaultValue={RequestData.sourceCity.name}
                >
                  {cityData?.data?.result?.items?.map((ele: any) => {
                    return (
                      <Select value={ele.id} key={ele?.id}>
                        {ele.name}
                      </Select>
                    );
                  })}
                </Select>
              </BaseForm.Item>
              <BaseForm.Item
                name="sourceAddress"
                label={<LableText>{t('addRequest.sourceAddress')}</LableText>}
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
                <Input defaultValue={RequestData.sourceAddress} />
              </BaseForm.Item>
              <BaseForm.Item
                // name="moveAtUtc"
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
                <DatePicker
                  style={{ width: '100%' }}
                  defaultValue={RequestData?.moveAtUtc ? moment(RequestData.moveAtUtc) : undefined}
                />
              </BaseForm.Item>
              <div
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

              <h4 style={{ margin: '5rem 0 2rem', fontWeight: '700' }}>{t('addRequest.destinationLocations')}:</h4>
              <BaseForm.Item
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
                  onChange={(e) => ChangeCountryHandler(e, 'destination')}
                  defaultValue={RequestData.destinationCity.country.name}
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
              <BaseForm.Item
                name={['destinationCityId']}
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
                  onChange={(e) => ChangeCityHandler(e, 'destination')}
                  defaultValue={RequestData.destinationCity.name}
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
              <BaseForm.Item
                name="destinationAddress"
                label={<LableText>{t('addRequest.destinationAddress')}</LableText>}
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
                <Input defaultValue={RequestData.destinationAddress} />
              </BaseForm.Item>
              <BaseForm.Item
                // name="arrivalAtUtc"
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
                <DatePicker
                  style={{ width: '100%' }}
                  defaultValue={RequestData?.arrivalAtUtc ? moment(RequestData.arrivalAtUtc) : undefined}
                />
              </BaseForm.Item>
              <div
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
            </>
          )}

          {current === 3 && (
            <>
              <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.ForSource')}:</h4>
              <BaseForm.Item
                name={['requestForQuotationContacts', 0, 'fullName']}
                label={<LableText>{t('common.fullName')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              >
                <Input defaultValue={RequestData.requestForQuotationContacts[0].fullName} />
              </BaseForm.Item>

              <BaseForm.Item
                key={current}
                name={['requestForQuotationContacts', 0, 'phoneNumber']}
                label={t('common.phoneNumber')}
                rules={[
                  { required: true, message: t('common.requiredField') },
                  () => ({
                    validator(_, value) {
                      if (!value || isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      }
                      if (value.length > 9) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                      } else if (value.length < 9) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                      }
                    },
                  }),
                ]}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              >
                <Input
                  addonBefore={'+971'}
                  value={RequestData.requestForQuotationContacts[0]?.phoneNumber}
                  onChange={(e) => {
                    if (validationInputNumber(e.target.value)) {
                      form.setFieldValue(['requestForQuotationContacts', 0, 'phoneNumber'], e.target.value);
                    } else form.setFieldValue(['requestForQuotationContacts', 0, 'phoneNumber'], '');
                  }}
                  maxLength={9}
                  style={{ width: '100%' }}
                />
              </BaseForm.Item>

              <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.ForDestination')}:</h4>
              <BaseForm.Item
                name={['requestForQuotationContacts', 1, 'fullName']}
                label={<LableText>{t('common.fullName')}</LableText>}
                rules={[
                  { required: true, message: <p style={{ fontSize: FONT_SIZE.xs }}>{t('common.requiredField')}</p> },
                ]}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              >
                <Input defaultValue={RequestData.requestForQuotationContacts[1].fullName} />
              </BaseForm.Item>

              <BaseForm.Item
                key={current}
                name={['requestForQuotationContacts', 1, 'phoneNumber']}
                label={t('common.phoneNumber')}
                rules={[
                  { required: true, message: t('common.requiredField') },
                  () => ({
                    validator(_, value) {
                      if (!value || isValidPhoneNumber(value)) {
                        return Promise.resolve();
                      }
                      if (value.length > 9) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsLong')));
                      } else if (value.length < 9) {
                        return Promise.reject(new Error(t('auth.phoneNumberIsShort')));
                      }
                    },
                  }),
                ]}
                style={isDesktop || isTablet ? { width: '50%', margin: 'auto' } : { width: '80%', margin: '0 10%' }}
              >
                <Input
                  addonBefore={'+971'}
                  value={RequestData.requestForQuotationContacts[0]?.phoneNumber}
                  onChange={(e) => {
                    if (validationInputNumber(e.target.value)) {
                      form.setFieldValue(['requestForQuotationContacts', 1, 'phoneNumber'], e.target.value);
                    } else form.setFieldValue(['requestForQuotationContacts', 1, 'phoneNumber'], '');
                  }}
                  maxLength={9}
                  style={{ width: '100%' }}
                />
              </BaseForm.Item>

              {/* <BaseButtonsForm.Item
                name={['requestForQuotationContacts', 1, 'phoneNumber']}
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
                        width: 'fit-content',
                        margin: '2rem auto',
                        direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                      }
                    : {
                        width: 'fit-content',
                        margin: '2rem auto',
                        direction: localStorage.getItem('Go Movaro-lang') == 'en' ? 'ltr' : 'rtl',
                      }
                }
              >
                <PhoneInput
                  onChange={handleFormattedValueChange}
                  country={'ae'}
                  value={
                    RequestData.requestForQuotationContacts[1]?.dailCode +
                    RequestData.requestForQuotationContacts[1]?.phoneNumber
                  }
                />
              </BaseButtonsForm.Item> */}
            </>
          )}

          {current === 4 && (
            <>
              <h4 style={{ margin: '2rem 0', fontWeight: '700' }}>{t('addRequest.selectService')} :</h4>
              <BaseForm.Item key="100" name={['services']}>
                <Tree
                  style={treeStyle}
                  checkable
                  defaultExpandAll={true}
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={(checkedKeysValue: any, info: any) => {
                    setDefaultCheckedServices(checkedKeysValue);
                    requestServicesArray = [...checkedKeysValue];
                  }}
                  defaultCheckedKeys={defaultCheckedServices}
                  checkedKeys={defaultCheckedServices}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={treeData}
                />
              </BaseForm.Item>

              <BaseForm.Item name={['comment']}>
                <TextArea aria-label="comment" style={{ margin: '1rem  0' }} placeholder={t('requests.comment')} />
              </BaseForm.Item>
            </>
          )}
        </BaseForm>
      )}
    </Card>
  );
};
