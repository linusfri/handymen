import React from 'react';
import { View } from 'react-native';
import { Href, Link } from 'expo-router';
import { Text } from 'components/text/text';
import MaterialSymbol, { glyphMap } from 'lib/icons/material-symbols';
import { cn } from 'lib/utils';

type IconLinkProps = {
  href: Href;
  text: string;
  icon?: keyof typeof glyphMap;
  iconAlignment?: 'left' | 'right';
  className?: string;
};

function IconLink({ href, text, icon = 'keyboardArrowRight', iconAlignment = 'right', className }: IconLinkProps) {
  return (
    <Link href={href}>
      <View className={cn('flex-row items-center gap-1', className)}>
        {iconAlignment === 'left' && (
          <MaterialSymbol name={icon} className={cn('text-base text-primary')} />
        )}
        <Text className={cn('font-semibold text-sm leading-6 text-primary')}>{text}</Text>
        {iconAlignment === 'right' && (
          <MaterialSymbol name={icon} className={cn('text-base text-primary')} />
        )}
      </View>
    </Link>
  );
}

export default IconLink;
