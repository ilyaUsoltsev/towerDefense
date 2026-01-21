import { Text } from '@gravity-ui/uikit';
import { ColorTextBaseProps } from '@gravity-ui/uikit/build/cjs/components/Text/colorText/colorText';

interface Props {
  color: ColorTextBaseProps['color'];
  title: string;
  value: string;
}

const GameStatsItem = ({ color, title, value }: Props) => {
  return (
    <Text color={color} variant="body-3">
      {title}: <Text variant="subheader-3">{value}</Text>
    </Text>
  );
};

export default GameStatsItem;
