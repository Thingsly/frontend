interface Option {
  label: string;
  value: any;
  children?: Option[];
}

interface BasicProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface FormItemBase {
  type: string;
  key: string;
  props?: BasicProps;
}

interface AutoCompleteItem extends FormItemBase {
  type: 'AutoComplete';
  fetchSuggestions: (query: string) => Promise<Option[]>;
}

interface SelectItem extends FormItemBase {
  type: 'Select';
  options: Option[];
  multiple?: boolean;
}

interface CascaderItem extends FormItemBase {
  type: 'Cascader';
  options: Option[];
}

interface CheckboxItem extends FormItemBase {
  type: 'Checkbox';
  checked?: boolean;
}

interface CheckboxGroupItem extends FormItemBase {
  type: 'CheckboxGroup';
  options: Option[];
}

interface RadioItem extends FormItemBase {
  type: 'Radio';
  checked?: boolean;
}

interface RadioGroupItem extends FormItemBase {
  type: 'RadioGroup';
  options: Option[];
}

interface SwitchItem extends FormItemBase {
  type: 'Switch';
  checked?: boolean;
}

interface SliderItem extends FormItemBase {
  type: 'Slider';
  value?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface DatePickerItem extends FormItemBase {
  type: 'DatePicker';
  value?: string;
}

interface TimePickerItem extends FormItemBase {
  type: 'TimePicker';
  value?: string;
}

interface DateTimePickerItem extends FormItemBase {
  type: 'DateTimePicker';
  value?: string;
}

interface UploadItem extends FormItemBase {
  type: 'Upload';
  fileList?: Array<{
    name: string;
    url: string;
  }>;
}

interface DynamicTagsItem extends FormItemBase {
  type: 'DynamicTags';
  tags?: string[];
}

interface TreeSelectItem extends FormItemBase {
  type: 'TreeSelect';
  treeData: Option[];
}

interface InputNumberItem extends FormItemBase {
  type: 'InputNumber';
  value?: number;
  min?: number;
  max?: number;
}

interface RateItem extends FormItemBase {
  type: 'Rate';
  value?: number;
}

interface TransferItem extends FormItemBase {
  type: 'Transfer';
  dataSource: Option[];
  targetKeys: any[];
}

interface ColorPickerItem extends FormItemBase {
  type: 'ColorPicker';
  value?: string;
}

interface ValidationRule {
  required?: boolean;
  message: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

type FormItem =
  | AutoCompleteItem
  | SelectItem
  | CascaderItem
  | CheckboxItem
  | CheckboxGroupItem
  | RadioItem
  | RadioGroupItem
  | SwitchItem
  | SliderItem
  | DatePickerItem
  | TimePickerItem
  | DateTimePickerItem
  | UploadItem
  | DynamicTagsItem
  | TreeSelectItem
  | InputNumberItem
  | RateItem
  | TransferItem
  | ColorPickerItem;

interface FormJson {
  items: FormItem[];
}
