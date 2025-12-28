import { cn, formatItemPrice, getFileUrl } from 'lib/utils';
import React from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { Product } from 'lib/types/product';
import { Text } from 'components/text/text';
import { Link } from 'expo-router';

interface ProductListingProps {
  items: Product[];
  className?: string;
  imageClassName?: string;
}

export function ProductListing({ items, className, imageClassName }: ProductListingProps) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView className={cn('w-full', className)}>
      <View className="flex-row flex-wrap justify-between">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
          >
            <View style={{ width: screenWidth / 2 - 24 }} className={cn('mb-4')}>
              <Image
                source={{ uri: item.images.length > 0 ? getFileUrl(item.images[0].uri) : undefined }}
                className={cn('aspect-square w-full rounded-md', imageClassName)}
                resizeMode="cover"
              />
              <View className="mt-2">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-600">{formatItemPrice(item.price)}</Text>
                <Text
                  className={cn(
                    'mt-1 text-xs',
                    item.status === 'available' ? 'text-green-600' : 'text-gray-500'
                  )}
                >
                  {item.status === 'available' ? 'Available' : 'Sold'}
                </Text>
              </View>
            </View>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
