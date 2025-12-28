import React, { useState } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from 'components/text/text';
import { cn, getFileUrl } from 'lib/utils';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from 'components/form/fields/input/controlled-input';
import { FormSelect } from 'components/form/fields/select/controlled-select';
import { Button } from 'components/ui/button';
import { t } from 'lib/i18n';
import { useProduct } from 'lib/hooks/product/use-product';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';

type ProductFormData = {
  name: string;
  description: string;
  status: string;
  price: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = parseInt(id ?? '0');

  const { product, isLoading, updateProduct, deleteProduct, isUpdating, isDeleting } =
    useProduct(productId);
  const [isEditMode, setIsEditMode] = useState(false);

  const { ...formMethods } = useForm<ProductFormData>({
    values: product
      ? {
          name: product.name,
          description: product.description ?? '',
          status: product.status,
          price: product.price.toString(),
        }
      : undefined,
  });

  const { handleSubmit, formState, reset } = formMethods;

  const statusOptions = [
    { label: t('createProduct.status.available'), value: 'available' },
    { label: t('createProduct.status.sold'), value: 'sold' },
  ];

  async function onSubmit(data: ProductFormData) {
    try {
      await updateProduct({
        name: data.name,
        description: data.description,
        status: data.status as 'available' | 'sold',
        price: parseFloat(data.price),
        images: [],
      });
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  function handleDelete() {
    Alert.alert(t('productDetail.deleteConfirmTitle'), t('productDetail.deleteConfirmMessage'), [
      {
        text: t('productDetail.cancel'),
        style: 'cancel',
      },
      {
        text: t('productDetail.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct();
            router.back();
          } catch (error) {
            console.error('Error deleting product:', error);
          }
        },
      },
    ]);
  }

  function handleCancel() {
    reset();
    setIsEditMode(false);
  }

  if (isLoading) {
    return <Loader text={t('states.loading')} />;
  }

  if (!product) {
    return <NotFound icon="info" title={t('productDetail.notFound')} />;
  }

  return (
    <ScrollView className={cn('flex-1 bg-background')}>
      <View className={cn('p-4')}>
        {isEditMode ? (
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
                variant="secondary"
                onPress={handleCancel}
                disabled={isUpdating}
              >
                <Text className={cn('font-semibold text-secondary-foreground')}>
                  {t('productDetail.cancel')}
                </Text>
              </Button>
              <Button
                className={cn('flex-1')}
                onPress={handleSubmit(onSubmit)}
                disabled={isUpdating}
              >
                <Text className={cn('font-semibold text-primary-foreground')}>
                  {t('productDetail.save')}
                </Text>
              </Button>
            </View>
          </FormProvider>
        ) : (
          <>
            <Image
              source={{ uri: product.images.length > 0 ? getFileUrl(product.images[0].uri) : undefined }}
              className={cn('aspect-square w-full rounded-md')}
              resizeMode="cover"
            />
            <Text className={cn('mb-2 font-bold text-2xl')}>{product.name}</Text>
            <Text className={cn('mb-4 text-xl text-muted-foreground')}>${product.price}</Text>
            <Text
              className={cn(
                'mb-4 text-sm',
                product.status === 'available' ? 'text-green-600' : 'text-gray-500'
              )}
            >
              {product.status === 'available'
                ? t('createProduct.status.available')
                : t('createProduct.status.sold')}
            </Text>
            {product.description && (
              <View className={cn('mb-6')}>
                <Text className={cn('mb-2 font-semibold')}>{t('productDetail.description')}</Text>
                <Text className={cn('text-muted-foreground')}>{product.description}</Text>
              </View>
            )}

            <View className={cn('mt-4 gap-3')}>
              <Button onPress={() => setIsEditMode(true)}>
                <Text className={cn('font-semibold text-primary-foreground')}>
                  {t('productDetail.edit')}
                </Text>
              </Button>
              <Button variant="destructive" onPress={handleDelete} disabled={isDeleting}>
                <Text className={cn('font-semibold text-destructive-foreground')}>
                  {t('productDetail.delete')}
                </Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
