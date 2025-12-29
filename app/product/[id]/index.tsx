import React from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'components/text/text';
import { cn, getFileUrl } from 'lib/utils';
import { Button } from 'components/ui/button';
import { t } from 'lib/i18n';
import { useProduct } from 'lib/hooks/product/use-product';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';
import { deleteProduct } from 'lib/services/product-service';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id ?? '0');

  const { product, isLoading, isDeleting } = useProduct(productId);

  if (isLoading) {
    return <Loader text={t('states.loading')} />;
  }

  if (!product) {
    return <NotFound icon="info" title={t('productDetail.notFound')} />;
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
            await deleteProduct(product!.id);
            router.back();
          } catch (error) {
            console.error('Error deleting product:', error);
          }
        },
      },
    ]);
  }

  return (
    <ScrollView className={cn('flex-1 bg-background')}>
      <View className={cn('p-4')}>
        <Image
          source={{
            uri: product.images.length > 0 ? getFileUrl(product.images[0].uri) : undefined,
          }}
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
          <Link className={cn('flex bg-primary p-3 rounded-md')} href={`/product/${product.id}/edit`}>
            <Text className={cn('font-semibold text-center text-primary-foreground')}>
              {t('productDetail.edit')}
            </Text>
          </Link>
          <Button variant="destructive" onPress={handleDelete} disabled={isDeleting}>
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('productDetail.delete')}
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
