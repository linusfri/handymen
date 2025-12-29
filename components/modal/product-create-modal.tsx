import React from 'react';
import { Text } from 'components/text/text';
import { cn } from 'lib/utils';
import Modal from 'components/modal/modal';
import { t } from 'lib/i18n';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from 'components/form/fields/input/controlled-input';
import { FormSelect } from 'components/form/fields/select/controlled-select';
import { Button } from 'components/ui/button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export type ProductFormData = {
  name: string;
  description: string;
  status: string;
  price: string;
  productImages: string[];
};

export default function ProductCreateModal({
  modalVisible,
  submitFn,
  setModalVisible,
}: {
  modalVisible: boolean;
  submitFn: (data: ProductFormData) => Promise<void>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { ...formMethods } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      status: 'available',
      price: '',
    },
  });

  const { handleSubmit, formState, reset } = formMethods;

  const statusOptions = [
    { label: t('createProduct.status.available'), value: 'available' },
    { label: t('createProduct.status.sold'), value: 'sold' },
  ];

  async function onSubmit(data: ProductFormData) {
    await submitFn(data);
    reset();
  }

  return (
    <Modal
      visible={modalVisible}
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
            options={statusOptions}
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

          <Button className={cn('mb-4')} onPress={handleSubmit(onSubmit)} disabled={formState.isSubmitting}>
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('createProduct.submit')}
            </Text>
          </Button>
          <Button className={cn('bg-destructive')} onPress={() => setModalVisible(false)} disabled={formState.isSubmitting}>
            <Text className={cn('font-semibold bg-destructive text-primary-foreground')}>
              {t('productDetail.cancel')}
            </Text>
          </Button>
        </FormProvider>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
