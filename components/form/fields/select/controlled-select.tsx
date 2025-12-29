import React from 'react';
import { useController, useFormContext, UseControllerProps } from 'react-hook-form';
import { View } from 'react-native';
import { Text } from 'components/text/text';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
import { cn } from 'lib/utils';

type Option = {
  label: string;
  value: string;
};

type ControlledSelectProps = UseControllerProps & {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  containerClassName?: string;
  options: Option[];
  variant?: 'default' | 'secondary';
  portalHost?: string;
};

function ControlledSelect(props: ControlledSelectProps) {
  const { name, rules, defaultValue, options, variant = 'default', portalHost, ...selectProps } = props;
  const { field, fieldState } = useController({ name, rules, defaultValue });

  const selectedOption = options.find(opt => opt.value === field.value);

  return (
    <View className={cn(selectProps.containerClassName)}>
      <View className={cn('mb-1')}>
        <Text
          className={cn(
            'mb-2 text-xs font-semibold text-muted-foreground',
            fieldState.error && 'text-primary'
          )}
        >
          {selectProps.label}
        </Text>
        <Select
          value={selectedOption}
          onValueChange={(option) => {
            if (option) {
              field.onChange(option.value);
            }
          }}
        >
          <SelectTrigger variant={variant} className="w-full">
            <SelectValue
              className="text-sm native:text-lg"
              placeholder={selectProps.placeholder || selectProps.label}
            />
          </SelectTrigger>
          <View>
          <SelectContent className={cn('left-4 right-4')} portalHost={portalHost}  align="center">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
          </View>
        </Select>
      </View>
      {fieldState.error && (
        <Text className={cn('text-xs text-primary')}>{fieldState.error.message}</Text>
      )}
    </View>
  );
}

export function FormSelect(props: ControlledSelectProps) {
  const formContext = useFormContext();

  const { name } = props;

  if (!formContext || !name) {
    const msg = !formContext
      ? 'Select must be wrapped by the FormProvider'
      : 'Name must be defined';
    console.error(msg);
    return null;
  }

  return <ControlledSelect {...props} />;
}
