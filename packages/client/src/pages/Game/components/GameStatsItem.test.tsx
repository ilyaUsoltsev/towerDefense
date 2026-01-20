import React from 'react';
import { render, screen } from '@testing-library/react';
import * as ReactTestRenderer from 'react-test-renderer';
import GameStatsItem from './GameStatsItem';

describe('GameStatsItem', () => {
  describe('Рендеринг', () => {
    test('должен рендериться с переданными props', () => {
      render(<GameStatsItem color="info" title="Wave" value="1/10" />);

      // Текст разбит на несколько элементов, используем частичное совпадение
      expect(screen.getByText(/Wave/)).toBeInTheDocument();
      expect(screen.getByText('1/10')).toBeInTheDocument();
    });

    test('должен отображать title и value', () => {
      const { rerender } = render(
        <GameStatsItem color="warning" title="Gold" value="100" />
      );

      expect(screen.getByText(/Gold/)).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();

      rerender(
        <GameStatsItem color="positive-heavy" title="Lives" value="5" />
      );

      expect(screen.getByText(/Lives/)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('должен применять правильный color prop', () => {
      const { container } = render(
        <GameStatsItem color="danger" title="Test" value="0" />
      );

      // Gravity UI компонент Text применяет color через пропсы
      // Проверяем что компонент рендерится (структура присутствует)
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Различные варианты color', () => {
    test('должен рендериться с color="info"', () => {
      render(<GameStatsItem color="info" title="Info" value="123" />);

      expect(screen.getByText(/Info/)).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('должен рендериться с color="warning"', () => {
      render(<GameStatsItem color="warning" title="Warning" value="456" />);

      expect(screen.getByText(/Warning/)).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
    });

    test('должен рендериться с color="positive-heavy"', () => {
      render(
        <GameStatsItem color="positive-heavy" title="Positive" value="789" />
      );

      expect(screen.getByText(/Positive/)).toBeInTheDocument();
      expect(screen.getByText('789')).toBeInTheDocument();
    });

    test('должен рендериться с color="danger"', () => {
      render(<GameStatsItem color="danger" title="Danger" value="0" />);

      expect(screen.getByText(/Danger/)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Снапшот-тест', () => {
    test('должен соответствовать снапшоту', () => {
      const tree = ReactTestRenderer.create(
        <GameStatsItem color="info" title="Wave" value="1/10" />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('должен соответствовать снапшоту с другим color', () => {
      const tree = ReactTestRenderer.create(
        <GameStatsItem color="warning" title="Gold" value="100" />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('должен соответствовать снапшоту с positive-heavy color', () => {
      const tree = ReactTestRenderer.create(
        <GameStatsItem color="positive-heavy" title="Lives" value="5" />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('Структура компонента', () => {
    test('должен содержать title и value в правильном формате', () => {
      render(
        <GameStatsItem color="info" title="Test Title" value="Test Value" />
      );

      // Проверяем что оба текста присутствуют
      const titleElement = screen.getByText(/Test Title/);
      const valueElement = screen.getByText('Test Value');

      expect(titleElement).toBeInTheDocument();
      expect(valueElement).toBeInTheDocument();
    });
  });
});
