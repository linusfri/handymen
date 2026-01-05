import * as React from 'react';
import { View } from 'react-native';
import MaterialSymbol, { IconName } from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';

type AppIconProps = {
  name: IconName;
  backgroundColor?: string;
  color?: string;
};

export default function AppIcon({
  name,
  backgroundColor,
  color,
}: AppIconProps) {
  return (
    <View
      className={cn(
        'w-10 h-10 flex items-center justify-center aspect-square rounded-lg overflow-hidden',
        backgroundColor ?? 'bg-primary/10'
      )}
    >
      <MaterialSymbol
        name={name}
        className={cn('text-neutral-700 text-xl align-middle', color ?? 'text-primary')}
      />
    </View>
  );
}
