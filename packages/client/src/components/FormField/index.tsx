import { Field } from 'react-final-form';
import { TextInput, TextInputProps } from '@gravity-ui/uikit';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: TextInputProps['type'];
  size?: TextInputProps['size'];
}

/**
 * Переиспользуемый компонент поля формы с интеграцией react-final-form
 * Автоматически обрабатывает валидацию и отображение ошибок
 */
export const FormField = ({
  name,
  label,
  placeholder,
  type = 'text',
  size = 'l',
}: FormFieldProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <TextInput
          {...input}
          size={size}
          type={type}
          placeholder={placeholder}
          label={label}
          validationState={meta.error && meta.touched ? 'invalid' : undefined}
          errorMessage={meta.touched ? meta.error || '' : ''}
          errorPlacement="outside"
        />
      )}
    </Field>
  );
};
