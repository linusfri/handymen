import React, { useState } from 'react';
import { Text } from 'components/text/text';
import { cn } from 'lib/utils';
import Modal from 'components/modal/modal';
import { t } from 'lib/i18n';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from 'components/form/fields/input/controlled-input';
import { FormSelect } from 'components/form/fields/select/controlled-select';
import { Button } from 'components/ui/button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Pressable, View } from 'react-native';
import MaterialSymbol from 'lib/icons/material-symbols';
import ImagePickerModal from 'components/modal/image-picker-modal';
import { useProducts } from 'lib/hooks/product/use-products';
import { Separator } from 'components/ui/separator';
import { Product, ProductStatus, ProductCreateData, ProductEditData } from 'lib/types/product';

export type ProductCreateFormData = {
  name: string;
  description: string;
  status: string;
  price: string;
};

export type ProductEditFormData = {
  id: number;
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

type EditProductModalProps = {
  action: 'edit';
  product: Product;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductEditOrCreateModal(
  props: CreateProductModalProps | EditProductModalProps
) {
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const { createProduct, editProduct } = useProducts();

  const defaultValues =
    props.action === 'create'
      ? ({
          name: '',
          description: '',
          status: 'available' as ProductStatus,
          price: '',
        } as ProductCreateFormData)
      : ({
          id: props.product.id,
          name: props.product.name,
          description: props.product.description || '',
          status: props.product.status as ProductStatus,
          price: props.product.price.toString(),
        } as ProductEditFormData);

  const { ...formMethods } = useForm<ProductCreateFormData | ProductEditFormData>({
    defaultValues,
  });

  const { handleSubmit, formState, reset } = formMethods;

  const productStatusOptions = [
    { label: t('createProduct.status.available'), value: 'available' },
    { label: t('createProduct.status.sold'), value: 'sold' },
  ];

  async function onSubmit(data: ProductCreateFormData | ProductEditFormData) {
    if (props.action === 'create') {
      submitCreateProduct({
        name: data.name,
        description: data.description,
        status: data.status as ProductStatus,
        price: parseFloat(data.price),
        image_ids: selectedImageIds,
      } as ProductCreateData);
    } else {
      submitEditProduct({
        id: props.product.id,
        name: data.name,
        description: data.description,
        status: data.status as ProductStatus,
        price: parseFloat(data.price),
        image_ids: selectedImageIds,
      });
    }

    reset();
    setSelectedImageIds([]);
    props.setModalVisible(false);
  }

  async function submitCreateProduct(data: ProductCreateData) {
    createProduct(data, {
      onError: (error) => {
        console.error('Error creating product:', error);
      },
    });
  }

  async function submitEditProduct(data: ProductEditData) {
    editProduct(data, {
      onError: (error) => {
        console.error('Error editing product:', error);
      },
    });
  }

  function removeImage(index: number) {
    setSelectedImageIds((prev) => prev.filter((_, i) => i !== index));
  }

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
        <Text className={cn('mb-2 font-bold text-lg')}>{t('createProduct.title')}</Text>
        <FormProvider {...formMethods}>
          <Text className={cn('mb-8')}>{t('createProduct.description')}</Text>

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-4"
            name="name"
            label={t('createProduct.fields.name')}
            placeholder={t('createProduct.fields.name')}
            rules={{
              required: {
                value: true,
                message: t('createProduct.validation.nameRequired'),
              },
              maxLength: {
                value: 255,
                message: t('createProduct.validation.nameMaxLength'),
              },
            }}
          />

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-4"
            name="description"
            label={t('createProduct.fields.description')}
            placeholder={t('createProduct.fields.description')}
            multiline
            numberOfLines={4}
          />

          <FormSelect
            containerClassName="mb-4"
            name="status"
            label={t('createProduct.fields.status')}
            placeholder={t('createProduct.fields.statusPlaceholder')}
            options={productStatusOptions}
            rules={{
              required: {
                value: true,
                message: t('createProduct.validation.statusRequired'),
              },
            }}
            variant="secondary"
            portalHost="modal-portal"
          />

          <FormInput
            editable={!formState.isSubmitting}
            containerClassName="mb-6"
            name="price"
            label={t('createProduct.fields.price')}
            placeholder={t('createProduct.fields.price')}
            keyboardType="decimal-pad"
            rules={{
              required: {
                value: true,
                message: t('createProduct.validation.priceRequired'),
              },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: t('createProduct.validation.priceInvalid'),
              },
            }}
          />

          {/* Image selection section */}
          <View className={cn('mb-4')}>
            <Text className={cn('mb-2 font-medium')}>{t('createProduct.fields.images')}</Text>
            <Button
              className={cn('mb-2')}
              onPress={() => setImagePickerVisible(true)}
              disabled={formState.isSubmitting}
              variant="secondary"
            >
              <MaterialSymbol name="addPhotoAlternate" className={cn('mr-2 text-xl')} />
              <Text className={cn('font-semibold')}>{t('createProduct.addImages')}</Text>
            </Button>

            {selectedImageIds.length > 0 && (
              <View className={cn('mt-2 flex-row flex-wrap gap-2')}>
                {selectedImageIds.map((id, index) => (
                  <View key={`existing-${id}`} className={cn('relative')}>
                    <View
                      className={cn('h-20 w-20 items-center justify-center rounded-lg bg-gray-200')}
                    >
                      <Text className={cn('text-xs')}>ID: {id}</Text>
                    </View>
                    <Pressable
                      className={cn(
                        'absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive'
                      )}
                      onPress={() => removeImage(index)}
                    >
                      <MaterialSymbol name="close" className={cn('text-sm text-white')} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Separator className="mb-6" />

          <Button
            className={cn('mb-4')}
            onPress={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
          >
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('createProduct.submit')}
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
        <ImagePickerModal
          modalVisible={imagePickerVisible}
          context="product"
          setModalVisible={setImagePickerVisible}
          selectedImageIds={selectedImageIds}
          setSelectedImageIds={setSelectedImageIds}
        />
      )}
    </Modal>
  );
}
