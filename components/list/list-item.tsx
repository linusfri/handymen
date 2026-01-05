import { Href, Link } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Card, CardTitle, CardContent, CardDescription } from 'components/ui/card';
import { cn } from 'lib/utils';
import { memo } from 'react';
import MaterialSymbol, { IconName } from 'lib/icons/material-symbols';
import AppIcon from 'components/icon/app-icon';

export type ListItemProps = {
  title: string;
  description?: string;
  icon?: { name: IconName; color?: string; backgroundColor?: string };
  href?: Href;
  containerClassName?: string;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
};

const ListItem = memo(
  ({
    title,
    description,
    icon,
    href,
    containerClassName,
    onPress,
    showArrow = true,
    disabled = false,
  }: ListItemProps) => {
    const content = (
      <Card
        className={cn(
          'flex w-full flex-row rounded-none border-none bg-white',
          disabled && 'opacity-50',
          containerClassName
        )}
        style={{
          outlineWidth: 1,
          outlineColor: '#E3E3E3', // gray-200
        }}
      >
        <CardContent className={cn('flex items-center justify-center p-4')}>
          {icon && <AppIcon name={icon.name} color={icon.color} backgroundColor={icon.backgroundColor} />}
        </CardContent>

        <CardContent className={cn('flex-1 justify-center py-4')}>
          <CardTitle className={cn('mb-1 p-0 font-bold text-sm text-black')}>{title}</CardTitle>
          {description && (
            <CardDescription className={cn('text-xs text-gray-500')}>{description}</CardDescription>
          )}
        </CardContent>

        {showArrow && (
          <CardContent className={cn('flex items-center justify-center p-4')}>
            <MaterialSymbol name="arrowForwardIos" className={cn('icon-xs text-gray-500')} />
          </CardContent>
        )}
      </Card>
    );

    if (href && !disabled) {
      return (
        <Link href={href} onPress={onPress}>
          {content}
        </Link>
      );
    }

    return <View onTouchEnd={disabled ? undefined : onPress}>{content}</View>;
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
