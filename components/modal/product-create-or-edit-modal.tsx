import React, { useEffect, useState } from 'react';
import { Text } from 'components/text/text';
import { cn } from 'lib/utils';
import Modal from 'components/modal/modal';
import { t } from 'lib/i18n';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from 'components/form/fields/input/controlled-input';
import { FormSelect } from 'components/form/fields/select/controlled-select';
import { Button } from 'components/ui/button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { View } from 'react-native';
import MaterialSymbol from 'lib/icons/material-symbols';
import FilePickerModal from 'components/modal/image-picker-modal';
import { Separator } from 'components/ui/separator';
import { ProductStatus, ProductCreateData, ProductEditData } from 'lib/types/product';
import { useProduct } from 'lib/hooks/product/use-product';
import Loader from 'components/loader/loader';
import { useFiles } from 'lib/hooks/image/use-images';
import FileListing from 'components/image/image-listing';

export type ProductCreateFormData = {
  name: string;
  description: string;
  status: string;
  price: string;
};

export type ProductEditFormData = {
  name: string;
  description: string;
  status: string;
  price: string;
};

type CreateProductModalProps = {
  action: 'create';
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

type UpdateProductModalProps = {
  action: 'edit';
  productId: number;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductEditOrCreateModal(
  props: CreateProductModalProps | UpdateProductModalProps
) {
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const { files } = useFiles();

  const currentFileObjects = files?.filter((file) => selectedFileIds.includes(file.id));

  const { product, isLoading, createProduct, updateProduct } = useProduct(
    props.action === 'edit' ? props.productId : undefined
  );

  if (props.action === 'edit' && (isLoading || !product)) {
    return <Loader text={t('states.loading')} />;
  }

  const defaultValues =
    props.action === 'create'
      ? ({
          name: '',
          description: '',
          status: 'available' as ProductStatus,
          price: '',
        } as ProductCreateFormData)
      : ({
          id: product!.id,
          name: product!.name,
          description: product!.description || '',
          status: product!.status as ProductStatus,
          price: product!.price.toString(),
        } as ProductEditFormData);

  const { ...formMethods } = useForm<ProductCreateFormData | ProductEditFormData>({
    defaultValues,
  });

  const { handleSubmit, formState, reset } = formMethods;

  const productStatusOptions = [
    { label: t('product.status.available'), value: 'available' },
    { label: t('product.status.sold'), value: 'sold' },
  ];

  async function onSubmit(data: ProductCreateFormData | ProductEditFormData) {
    if (props.action === 'create') {
      submitCreateProduct({
        name: data.name,
        description: data.description,
        status: data.status as ProductStatus,
        price: parseFloat(data.price),
        image_ids: selectedFileIds,
      } as ProductCreateData);
    } else {
      submitUpdateProduct({
        name: data.name,
        description: data.description,
        status: data.status as ProductStatus,
        price: parseFloat(data.price),
        image_ids: selectedFileIds,
      });
    }

    reset();
    setSelectedFileIds([]);
    props.setModalVisible(false);
  }

  async function submitCreateProduct(data: ProductCreateData) {
    createProduct(data, {
      onError: (error) => {
        console.error('Error creating product:', error);
      },
    });
  }

  async function submitUpdateProduct(data: ProductEditData) {
    updateProduct(
      { id: product!.id, data },
      {
        onError: (error) => {
          console.error('Error editing product:', error);
        },
      }
    );
  }

  function removeFile(index: number) {
    setSelectedFileIds((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    if (props.action === 'edit') {
      const imageIds = product!.images.map((image) => image.id);
      setSelectedFileIds(imageIds);
    }
  }, [props.modalVisible]);

  return (
    <Modal
      visible={props.modalVisible}
      statusBarTranslucent={true} // Android only, cover the status bar fullscreen
      presentationStyle="fullScreen" // iOS only
      contentClassName={cn('flex-1 rounded-none m-0 w-full')}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className={cn('flex-1')}
        keyboardShouldPersistTaps="handled"
        bottomOffset={40}
      >
        <Text className={cn('mb-2 font-bold text-lg')}>
          {props.action === 'create' ? t('product.create.title') : t('product.edit.title')}
        </Text>
        <FormProvider {...formMethods}>
          <Text className={cn('mb-8')}>
            {props.action === 'create'
              ? t('product.create.description')
              : t('product.edit.description')}
          </Text>

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-4"
            name="name"
            label={t('product.fields.name')}
            placeholder={t('product.fields.name')}
            rules={{
              required: {
                value: true,
                message: t('product.validation.nameRequired'),
              },
              maxLength: {
                value: 255,
                message: t('product.validation.nameMaxLength'),
              },
            }}
          />

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-4"
            name="description"
            label={t('product.fields.description')}
            placeholder={t('product.fields.description')}
            multiline
            numberOfLines={4}
          />

          <FormSelect
            containerClassName="mb-4"
            name="status"
            label={t('product.fields.status')}
            placeholder={t('product.fields.statusPlaceholder')}
            options={productStatusOptions}
            rules={{
              required: {
                value: true,
                message: t('product.validation.statusRequired'),
              },
            }}
            variant="secondary"
            portalHost="modal-portal"
          />

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-6"
            name="price"
            label={t('product.fields.price')}
            placeholder={t('product.fields.price')}
            keyboardType="decimal-pad"
            rules={{
              required: {
                value: true,
                message: t('product.validation.priceRequired'),
              },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: t('product.validation.priceInvalid'),
              },
            }}
          />

          {/* Image selection section */}
          <View className={cn('mb-4')}>
            <Text className={cn('mb-2 font-medium')}>{t('product.fields.images')}</Text>
            <Button
              className={cn('mb-2')}
              onPress={() => setImagePickerVisible(true)}
              disabled={formState.isSubmitting}
              variant="secondary"
            >
              <MaterialSymbol name="addPhotoAlternate" className={cn('mr-2 text-xl')} />
              <Text className={cn('font-semibold')}>{t('product.addImages')}</Text>
            </Button>
            <FileListing
              currentFileObjects={currentFileObjects}
              removeFile={removeFile}
            />
          </View>

          <Separator className="mb-6" />

          <Button
            className={cn('mb-4')}
            onPress={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
          >
            <Text className={cn('font-semibold text-primary-foreground')}>
              {props.action === 'create' ? t('product.create.submit') : t('product.edit.submit')}
            </Text>
          </Button>
          <Button
            className={cn('bg-destructive')}
            onPress={() => props.setModalVisible(false)}
            disabled={formState.isSubmitting}
          >
            <Text className={cn('bg-destructive font-semibold text-primary-foreground')}>
              {t('productDetail.cancel')}
            </Text>
          </Button>
        </FormProvider>
      </KeyboardAwareScrollView>

      {imagePickerVisible && (
        <FilePickerModal
          modalVisible={imagePickerVisible}
          context="product"
          setModalVisible={setImagePickerVisible}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
        />
      )}
    </Modal>
  );
}
