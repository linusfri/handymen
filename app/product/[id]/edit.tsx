import * as React from 'react';
import { Text } from 'components/text/text';
import { Image, View } from 'react-native';
import { t } from 'lib/i18n';
import { updateProduct } from 'lib/services/product-service';
import { useLocalSearchParams } from 'expo-router';
import { cn, getFileUrl } from 'lib/utils';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from 'components/form/fields/input/controlled-input';
import { FormSelect } from 'components/form/fields/select/controlled-select';
import { Button } from 'components/button/button';
import { useProduct } from 'lib/hooks/product/use-product';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';
import { ImageData } from 'lib/types/image';
import { ScrollView } from 'react-native-gesture-handler';

type EditProductFormData = {
  name: string;
  description: string;
  images: ImageData[];
  status: string;
  price: string;
};

export default function ProductEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id ?? '0');
  const { product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <Loader text={t('states.loading')} />;
  }

  if (!product) {
    return <NotFound icon="info" title={t('productDetail.notFound')} />;
  }

  const { ...formMethods } = useForm<EditProductFormData>({
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      images: product.images ?? [],
      status: product.status,
      price: product.price.toString(),
    },
  });

  const { handleSubmit, formState } = formMethods;
  const statusOptions = [
    { label: t('createProduct.status.available'), value: 'available' },
    { label: t('createProduct.status.sold'), value: 'sold' },
  ];

  async function onSubmit(data: EditProductFormData) {
    try {
      await updateProduct(product!.id, {
        name: data.name,
        description: data.description,
        status: data.status as 'available' | 'sold',
        price: parseFloat(data.price),
        images: [],
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  return (
    <ScrollView
      className={cn('p-4')}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 40,
      }}
    >
      <Image
        source={{ uri: getFileUrl(product.images[0]?.uri) }}
        className={cn('mb-8 w-full aspect-square rounded-md')}
        resizeMode="cover"
      />
      <FormProvider {...formMethods}>
        <Text className={cn('mb-6 font-bold text-2xl')}>{t('productDetail.editTitle')}</Text>

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

        <View className={cn('flex-row gap-2')}>
          <Button
            className={cn('flex-1')}
            onPress={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
          >
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('productDetail.save')}
            </Text>
          </Button>
        </View>
      </FormProvider>
    </ScrollView>
  );
}
