import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import MaterialSymbol from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';
import useRefreshToken from 'lib/hooks/auth/use-refresh-token';
import { t } from 'lib/i18n';
import { useProducts } from 'lib/hooks/product/use-products';
import { ProductListing } from 'components/list/product-listing';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';
import ProductEditOrCreateModal from 'components/modal/product-create-or-edit-modal';

export default function Home() {
  const [productCreateModalVisible, setProductCreateModalVisible] = useState(false);
  const { products, isLoading } = useProducts();

  useRefreshToken();

  if (isLoading) {
    return <Loader text={t('states.loading')} />;
  }

  return (
    <View className="flex-1 justify-center px-4 pb-4">
      {products && products.length > 0 ? (
        <ProductListing items={products} className="w-full pt-4" />
      ) : (
        <NotFound className={cn('flex-1')} title={t('products.noProducts')} />
      )}

      <View className={cn('flex flex-1 items-end justify-end')}>
        <Pressable
          className={cn('h-16 w-16 items-center justify-center rounded-sm bg-primary')}
          onPress={() => setProductCreateModalVisible(true)}
        >
          <MaterialSymbol name="add_2" className={cn('text-5xl text-white')} />
        </Pressable>
      </View>

      <ProductEditOrCreateModal
        action='create'
        modalVisible={productCreateModalVisible}
        setModalVisible={setProductCreateModalVisible}
      />
    </View>
  );
}
     