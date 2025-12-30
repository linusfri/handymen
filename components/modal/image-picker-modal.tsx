import React from 'react';
import { Text } from 'components/text/text';
import { cn, getFileUrl } from 'lib/utils';
import Modal from 'components/modal/modal';
import { t } from 'lib/i18n';
import { Button } from 'components/ui/button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useFiles } from 'lib/hooks/image/use-images';
import Loader from 'components/loader/loader';
import { Dimensions, Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FileContext, FileData } from 'lib/types/file';
import MaterialSymbol from 'lib/icons/material-symbols';

type ImagePickerModalProps = {
  modalVisible: boolean;
  context: FileContext;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFileIds: number[];
  setSelectedFileIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function FilePickerModal({
  modalVisible,
  context,
  setModalVisible,
  selectedFileIds,
  setSelectedFileIds,
}: ImagePickerModalProps) {
  const { files, isLoading, uploadFiles, isUploading } = useFiles();
  const screenWidth = Dimensions.get('window').width;

  function toggleFileSelection(imageId: number) {
    setSelectedFileIds((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );
  }

  async function handleUploadNewFile() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      await uploadFiles(
        {
          files: [
            {
              data: asset.base64 ?? '',
              filename: asset.fileName ?? 'unknown_file',
              filetype: asset.type || 'image',
              context: context,
            },
          ],
        },
        {
          onError: (error) => {
            console.error('Error uploading image:', error);
          },
        }
      );
    }
  }

  function handleSubmit() {
    setModalVisible(false);
  }

  function handleCancel() {
    setSelectedFileIds([]);
    setModalVisible(false);
  }

  return (
    <Modal
      visible={modalVisible}
      statusBarTranslucent={true}
      presentationStyle="fullScreen"
      contentClassName={cn('flex-1 rounded-none m-0 w-full')}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className={cn('flex-1')}
        keyboardShouldPersistTaps="handled"
        bottomOffset={40}
      >
        <Text className={cn('mb-2 font-bold text-lg')}>{t('imagePicker.title')}</Text>
        <Text className={cn('mb-4')}>{t('imagePicker.description')}</Text>

        {/* Upload new image button */}
        <Button className={cn('mb-6')} onPress={handleUploadNewFile} disabled={isUploading}>
          <MaterialSymbol
            name="addPhotoAlternate"
            className={cn('mr-2 text-xl text-primary-foreground')}
          />
          <Text className={cn('font-semibold text-primary-foreground')}>
            {isUploading ? t('imagePicker.uploading') : t('imagePicker.uploadNew')}
          </Text>
        </Button>

        {/* Existing images */}
        {isLoading ? (
          <Loader text={t('imagePicker.loading')} />
        ) : (
          <>
            <Text className={cn('mb-2 font-semibold')}>
              {t('imagePicker.existingImages', { selected: selectedFileIds.length })}
            </Text>
            <View className={cn('mb-6 flex-row flex-wrap gap-2')}>
              {files?.map((image: FileData) => {
                const isSelected = selectedFileIds.includes(image.id);
                return (
                  <Pressable
                    style={{ width: screenWidth / 2 - 32 }}
                    key={image.id}
                    onPress={() => toggleFileSelection(image.id)}
                    className={cn('relative rounded-md')}
                  >
                    <Image
                      source={{ uri: getFileUrl(image.uri) }}
                      className={cn('aspect-square w-full rounded-md border border-muted')}
                    />
                    {isSelected && (
                      <View
                        className={cn(
                          'absolute inset-0 items-center justify-center rounded-md bg-primary/30'
                        )}
                      >
                        <View
                          className={cn(
                            'h-8 w-8 items-center justify-center rounded-full bg-primary'
                          )}
                        >
                          <MaterialSymbol name="check" className={cn('text-xl text-white')} />
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Action buttons */}
        <View className={cn('mt-auto')}>
          <Button
            className={cn('mb-4')}
            onPress={handleSubmit}
            disabled={selectedFileIds.length === 0}
          >
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('imagePicker.select', { count: selectedFileIds.length })}
            </Text>
          </Button>
          <Button className={cn('bg-destructive')} onPress={handleCancel}>
            <Text className={cn('font-semibold text-primary-foreground')}>
              {t('imagePicker.cancel')}
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
