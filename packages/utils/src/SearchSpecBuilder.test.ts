import { SearchSpecBuilder } from './SearchSpecBuilder';
import { Operator } from './SearchSpecBuilder';

interface SearchCriteria {
  name?: string;
  age?: number;
  inactive?: boolean;
}

// Simulate the [Property] attribute
const propertyMap: Record<string, string> = {
  name: '[Person Name]',
  age: '[Age]',
  inactive: '[Deactivated At]',
};

const propertyName = (property: keyof SearchCriteria) => propertyMap[property];

describe('SearchSpecBuilder', () => {
  test('ToString_StringEqual', () => {
    const criteria: SearchCriteria = { name: 'pants' };
    const builder = new SearchSpecBuilder().where(propertyName('name'), criteria.name);
    expect(builder.toString()).toBe(`[Person Name] ~='pants'`);
  });

  test('ToString_StringLike', () => {
    const criteria: SearchCriteria = { name: 'pants*' };
    const builder = new SearchSpecBuilder().where(propertyName('name'), criteria.name);
    expect(builder.toString()).toBe(`[Person Name] ~ LIKE 'pants*'`);
  });

  const operatorCases: [Operator, string][] = [
    [Operator.EQ, '='],
    [Operator.GT, '>'],
    [Operator.LT, '<'],
    [Operator.GTE, '>='],
    [Operator.LTE, '<='],
  ];

  operatorCases.forEach(([op, symbol]) => {
    test(`ToString_IntOperator_${op}`, () => {
      const criteria: SearchCriteria = { age: 12 };
      const builder = new SearchSpecBuilder().andValue(propertyName('age'), op, criteria.age);
      expect(builder.toString()).toBe(`[Age]${symbol}12`);
    });
  });

  test('ToString_ChildClauses_CorrectlyBracketed', () => {
    const today = new Date();

    const builder = new SearchSpecBuilder()
      .where(propertyName('name'), '*pants*')
      .andValue(propertyName('age'), Operator.EQ, 12)
      .andChild(
        new SearchSpecBuilder()
          .where(propertyName('inactive'), null, true)
          .orDate(propertyName('inactive'), Operator.LTE, today)
      );

    expect(builder.toString()).toBe(
      `([Person Name] ~ LIKE '*pants*' AND [Age]=12 AND ([Deactivated At] IS NULL OR [Deactivated At]<='${today.toISOString()}'))`
    );
  });

  test('ToString_WhenOnlyChildClauses_ProducesSearchText', () => {
    const builder = new SearchSpecBuilder().andChild(new SearchSpecBuilder().where(propertyName('name'), 'pants*'));
    expect(builder.toString()).toBe(`[Person Name] ~ LIKE 'pants*'`);
  });

  test('ToString_WhenMultipleChildClauses_AddsBrackets', () => {
    const today = new Date();
    const builder = new SearchSpecBuilder()
      .andChild(
        new SearchSpecBuilder().where(propertyName('name'), 'pants*').andValue(propertyName('age'), Operator.GT, 12)
      )
      .andChild(new SearchSpecBuilder().orDate(propertyName('inactive'), Operator.GT, today));

    expect(builder.toString()).toBe(
      `([Person Name] ~ LIKE 'pants*' AND [Age]>12 AND ([Deactivated At]>'${today.toISOString()}'))`
    );
  });

  test('ToString_WhenTextContainsAQuote_QuoteIsEscaped', () => {
    const builder = new SearchSpecBuilder().where(propertyName('name'), "O'Doherty", false, true);
    expect(builder.toString()).toBe(`[Person Name]='O''Doherty'`);
  });

  test('ToString_NullStringExcluded_WhenNotIncludeIfNull', () => {
    const builder = new SearchSpecBuilder().where(propertyName('name'), null);
    expect(builder.toString()).toBe('');
  });

  test('ToString_NullStringIncluded_WhenIncludeIfNull', () => {
    const builder = new SearchSpecBuilder().where(propertyName('name'), null, true);
    expect(builder.toString()).toBe(`[Person Name] IS NULL`);
  });

  test('ToString_EmptyStringExcluded_WhenNotIncludeIfNull', () => {
    const builder = new SearchSpecBuilder().where(propertyName('name'), '');
    expect(builder.toString()).toBe('');
  });

  test('ToString_EmptyStringIncluded_WhenIncludeIfNull', () => {
    const builder = new SearchSpecBuilder().where(propertyName('name'), '', true);
    expect(builder.toString()).toBe(`[Person Name] IS NULL`);
  });
});
