import React from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'components/text/text';
import { cn, getFileUrl, formatItemPrice } from 'lib/utils';
import { Button } from 'components/ui/button';
import { t } from 'lib/i18n';
import { useProduct } from 'lib/hooks/product/use-product';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';
import ProductEditOrCreateModal from 'components/modal/product-create-or-edit-modal';
import FileListing from 'components/image/file-listing';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = parseInt(id ?? '0');
  const { product, isLoading, isDeleting, deleteProduct } = useProduct(productId);
  const [productEditModalVisible, setProductEditModalVisible] = React.useState(false);

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
          await deleteProduct(product!.id, {
            onError: (error) => {
              console.error('Error deleting product:', error);
            },
          });
          router.back();
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
        <FileListing currentFileObjects={product.images.slice(1)} containerClassName={cn('mb-6')}/>
        <Text className={cn('mb-2 font-bold text-2xl')}>{product.name}</Text>
        <Text className={cn('mb-4 text-xl text-muted-foreground')}>
          {formatItemPrice(product.price)}
        </Text>
        <Text
          className={cn(
            'mb-4 text-sm',
            product.status === 'available' ? 'text-green-600' : 'text-gray-500'
          )}
        >
          {product.status === 'available'
            ? t('product.status.available')
            : t('product.status.sold')}
        </Text>
        {product.description && (
          <View className={cn('mb-6')}>
            <Text className={cn('mb-2 font-semibold')}>{t('productDetail.description')}</Text>
            <Text className={cn('text-muted-foreground')}>{product.description}</Text>
          </View>
        )}

        <View className={cn('mt-4 gap-3')}>
          <Button size={'lg'} onPress={() => setProductEditModalVisible(true)}>
            <Text className={cn('text-center font-semibold text-primary-foreground')}>
              {t('productDetail.edit')}
            </Text>
          </Button>
          <Button variant="destructive" size={'sm'} onPress={handleDelete} disabled={isDeleting}>
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('productDetail.delete')}
            </Text>
          </Button>
        </View>
      </View>

      <ProductEditOrCreateModal
        action="edit"
        productId={product.id}
        setModalVisible={setProductEditModalVisible}
        modalVisible={productEditModalVisible}
      />
    </ScrollView>
  );
}
