import * as React from 'react';
import { View, Image, Pressable } from 'react-native';
import { cn } from 'lib/utils';
import MaterialSymbol from 'lib/icons/material-symbols';

export default function FileListing({
  currentFileObjects,
  removeFile,
  containerClassName,
}: {
  currentFileObjects: { id: number; uri: string }[] | undefined;
  removeFile?: (fileId: number) => void;
  containerClassName?: string;
}) {
  return (
    currentFileObjects &&
    currentFileObjects.length > 0 && (
      <View className={cn('mt-2 flex-row flex-wrap gap-2', containerClassName)}>
        {currentFileObjects.map((file) => (
          <View key={`existing-${file.id}`} className={cn('relative')}>
            <Image
              source={{ uri: file.uri }}
              className={cn('h-20 w-20 rounded-md')}
              resizeMode="cover"
            />
            {removeFile && (
              <Pressable
                className={cn(
                  'absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive'
                )}
                onPress={() => removeFile(file.id)}
              >
                <MaterialSymbol name="close" className={cn('text-sm text-white')} />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    )
  );
}
