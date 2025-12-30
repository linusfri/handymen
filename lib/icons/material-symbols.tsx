import createIconSet from '@expo/vector-icons/createIconSet';
import { cssInterop } from 'nativewind';
import { cn } from '../utils';
import { MaterialSymbols_100Thin } from '@expo-google-fonts/material-symbols/100Thin';
import { MaterialSymbols_200ExtraLight } from '@expo-google-fonts/material-symbols/200ExtraLight';
import { MaterialSymbols_300Light } from '@expo-google-fonts/material-symbols/300Light';
import { MaterialSymbols_400Regular } from '@expo-google-fonts/material-symbols/400Regular';
import { MaterialSymbols_500Medium } from '@expo-google-fonts/material-symbols/500Medium';
import { MaterialSymbols_600SemiBold } from '@expo-google-fonts/material-symbols/600SemiBold';
import { MaterialSymbols_700Bold } from '@expo-google-fonts/material-symbols/700Bold';
import * as React from 'react';

export const glyphMap = {
  add: 'add',
  add_2: 'add_2',
  addPhotoAlternate: 'add_photo_alternate',
  air: 'air',
  alternateEmail: 'alternate_email',
  apps: 'apps',
  arrowBack: 'arrow_back',
  arrowBackIos: 'arrow_back_ios',
  arrowDownward: 'arrow_downward',
  arrowForward: 'arrow_forward',
  arrowForwardIos: 'arrow_forward_ios',
  arrowUpward: 'arrow_upward',
  assignment: 'assignment',
  blurCircular: 'blur_circular',
  businessCenter: 'business_center',
  checkBox: 'check_box',
  check: 'check',
  checkBoxOutlineBlank: 'check_box_outline_blank',
  checkCircle: 'check_circle',
  circleCircle: 'circle_circle',
  close: 'close',
  darkMode: 'dark_mode',
  eggAlt: 'egg_alt',
  errorOutline: 'error_outline',
  grain: 'grain',
  groups: 'groups',
  home: 'home',
  hotelClass: 'hotel_class',
  info: 'info',
  keyboardArrowDown: 'keyboard_arrow_down',
  keyboardArrowLeft: 'keyboard_arrow_left',
  keyboardArrowRight: 'keyboard_arrow_right',
  keyboardArrowUp: 'keyboard_arrow_up',
  labs: 'labs',
  lightMode: 'light_mode',
  localShipping: 'local_shipping',
  microbiology: 'microbiology',
  modeCool: 'mode_cool',
  notifications: 'notifications',
  person: 'person',
  phoneInTalk: 'phone_in_talk',
  signalCellularAlt: 'signal_cellular_alt',
  searchOff: 'search_off',
  visibility: 'visibility',
  visibilityOff: 'visibility_off',
  waterDrop: 'water_drop',
};

const _MaterialSymbol100 = createIconSet(glyphMap, 'MaterialSymbolsThin', MaterialSymbols_100Thin);

const _MaterialSymbol200 = createIconSet(
  glyphMap,
  'MaterialSymbolsExtraLight',
  MaterialSymbols_200ExtraLight
);

const _MaterialSymbol300 = createIconSet(
  glyphMap,
  'MaterialSymbolsLight',
  MaterialSymbols_300Light
);

const _MaterialSymbol400 = createIconSet(
  glyphMap,
  'MaterialSymbolsRegular',
  MaterialSymbols_400Regular
);

const _MaterialSymbol500 = createIconSet(
  glyphMap,
  'MaterialSymbolsMedium',
  MaterialSymbols_500Medium
);

const _MaterialSymbol600 = createIconSet(
  glyphMap,
  'MaterialSymbolsSemiBold',
  MaterialSymbols_600SemiBold
);

const _MaterialSymbol700 = createIconSet(glyphMap, 'MaterialSymbolsBold', MaterialSymbols_700Bold);

export type IconName = keyof typeof glyphMap;

type MaterialSymbolProps = {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  onPress?: () => void;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
};

export default function MaterialSymbol(props: MaterialSymbolProps): React.ReactElement {
  let IconSet;
  switch (props.weight) {
    case 100:
      IconSet = _MaterialSymbol100;
      break;
    case 200:
      IconSet = _MaterialSymbol200;
      break;
    case 300:
      IconSet = _MaterialSymbol300;
      break;
    case 500:
      IconSet = _MaterialSymbol500;
      break;
    case 600:
      IconSet = _MaterialSymbol600;
      break;
    case 700:
      IconSet = _MaterialSymbol700;
      break;
    default:
      IconSet = _MaterialSymbol400;
  }

  const Icon = iconWithClassName(IconSet);

  return (
    <Icon
      name={props.name}
      size={props.size}
      color={props.color}
      onPress={props.onPress}
      className={cn(!props.color && 'text-foreground', props.className)}
    />
  );
}

function iconWithClassName(
  icon:
    | typeof _MaterialSymbol100
    | typeof _MaterialSymbol200
    | typeof _MaterialSymbol300
    | typeof _MaterialSymbol400
    | typeof _MaterialSymbol500
    | typeof _MaterialSymbol600
    | typeof _MaterialSymbol700
) {
  return cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        fontSize: 'size',
      },
    },
  });
}
