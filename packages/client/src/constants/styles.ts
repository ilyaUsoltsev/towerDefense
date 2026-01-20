/**
 * Константы для стилей приложения
 * Используйте эти значения для обеспечения единообразия
 */

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

/**
 * Вспомогательная функция для создания медиа-запросов
 * @example
 * const StyledDiv = styled.div`
 *   ${mediaQuery('mobile')} {
 *     padding: 16px;
 *   }
 * `;
 */
export const mediaQuery = (breakpoint: keyof typeof BREAKPOINTS) =>
  `@media (max-width: ${BREAKPOINTS[breakpoint]}px)`;
