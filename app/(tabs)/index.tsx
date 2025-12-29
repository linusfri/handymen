import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import MaterialSymbol from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';
import useRefreshToken from 'lib/hooks/auth/use-refresh-token';
import * as ImagePicker from 'expo-image-picker';
import { t } from 'lib/i18n';
import { useProducts } from 'lib/hooks/product/use-products';
import { ProductListing } from 'components/list/product-listing';
import Loader from 'components/loader/loader';
import { NotFound } from 'components/not-found/not-found';
import ProductCreateModal from 'components/modal/product-create-modal';
import { ProductFormData } from 'components/modal/product-create-modal';
import { ImageCreateData, NewImage } from 'lib/types/image';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [chosenImages, setChosenImages] = useState<ImageCreateData[]>([]);
  const { createProduct, products, isLoading } = useProducts();

  useRefreshToken();

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
      // allowsMultipleSelection: true, MUST COMPRESS IMAGES BEFORE USING THIS
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(
        (asset) =>
          ({
            id: asset.assetId ?? 0,
            kind: 'new',
            data: asset.base64 ?? '',
            filename: asset.fileName ?? 'unknown',
            mimetype: asset.type ?? 'image',
          }) as NewImage
      );

      setChosenImages(selectedImages);
      setModalVisible(true);
    }
  }

  async function onSubmit(data: ProductFormData) {
    createProduct(
      {
        name: data.name,
        description: data.description,
        status: data.status as 'available' | 'sold',
        price: parseFloat(data.price),
        images: chosenImages,
      },
      {
        onError: (error) => {
          console.error('Error creating product:', error);
        },
      }
    );

    setModalVisible(false);
  }

  if (isLoading) {
    return <Loader text={t('states.loading')} />;
  }

  return (
    <View className="flex-1 justify-center p-4">
      {products && products.length > 0 ? (
        <ProductListing items={products} className="w-full" />
      ) : (
        <NotFound className={cn('flex-1')} title={t('products.noProducts')} />
      )}

      <View className={cn('flex flex-1 items-end justify-end')}>
        <Pressable
          className={cn('h-16 w-16 items-center justify-center rounded-sm bg-primary')}
          onPress={pickImage}
        >
          <MaterialSymbol name="add_2" className={cn('text-5xl text-white')} />
        </Pressable>
      </View>

      <ProductCreateModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        submitFn={onSubmit}
      />
    </View>
  );
}
