export enum Operator {
  EQ = 'EQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
}

enum AndOr {
  And = 'AND',
  Or = 'OR',
}

type Clause = [AndOr, string, string, string];
type ChildClause = [AndOr, string];

export class SearchSpecBuilder {
  private _clauses: Clause[] = [];
  private _childClauses: ChildClause[] = [];

  constructor(private readonly ownerType?: any) {}

  get count(): number {
    return this._clauses.length;
  }

  public where(
    propertyName: string,
    value: string | null | undefined,
    includeIfNullOrEmpty = false,
    caseSensitive = false
  ): this {
    return this.and(propertyName, value, includeIfNullOrEmpty, caseSensitive);
  }

  public and(
    propertyName: string,
    value: string | null | undefined,
    includeIfNullOrEmpty = false,
    caseSensitive = false
  ): this {
    return this.includeString(AndOr.And, propertyName, value, includeIfNullOrEmpty, caseSensitive);
  }

  public or(
    propertyName: string,
    value: string | null | undefined,
    includeIfNullOrEmpty = false,
    caseSensitive = false
  ): this {
    return this.includeString(AndOr.Or, propertyName, value, includeIfNullOrEmpty, caseSensitive);
  }

  private includeString(
    andOr: AndOr,
    propertyName: string,
    value?: string | null,
    includeIfNullOrEmpty = false,
    caseSensitive = false
  ): this {
    if (value?.trim()) {
      if (value === '*') {
        this._clauses.push([andOr, propertyName, ' IS ', 'NOT NULL']);
      } else {
        const escapedValue = value.replace(/'/g, "''");
        const op = escapedValue.includes('*')
          ? this.caseInsensitiveOperator(' LIKE ', caseSensitive)
          : this.caseInsensitiveOperator('=', caseSensitive);
        this._clauses.push([andOr, propertyName, op, `'${escapedValue}'`]);
      }
    } else if (includeIfNullOrEmpty) {
      this._clauses.push([andOr, propertyName, ' IS ', 'NULL']);
    }

    return this;
  }

  private caseInsensitiveOperator(op: string, caseSensitive: boolean): string {
    return caseSensitive ? op : ` ~${op}`;
  }

  public andDate(propertyName: string, op: Operator, value: Date | null | undefined, includeIfNull = false): this {
    return this.includeDate(AndOr.And, propertyName, op, value, includeIfNull);
  }

  public orDate(propertyName: string, op: Operator, value: Date | null | undefined, includeIfNull = false): this {
    return this.includeDate(AndOr.Or, propertyName, op, value, includeIfNull);
  }

  private includeDate(
    andOr: AndOr,
    propertyName: string,
    op: Operator,
    value: Date | null | undefined,
    includeIfNull: boolean
  ): this {
    if (value) {
      const formatted = `'${value.toISOString()}'`;
      return this.include(andOr, propertyName, op, formatted, false);
    } else if (includeIfNull) {
      return this.include(andOr, propertyName, op, null, true);
    }
    return this;
  }

  public andValue(propertyName: string, op: Operator, value: any, includeIfNull = false): this {
    return this.include(AndOr.And, propertyName, op, value, includeIfNull);
  }

  public orValue(propertyName: string, op: Operator, value: any, includeIfNull = false): this {
    return this.include(AndOr.Or, propertyName, op, value, includeIfNull);
  }

  private include(andOr: AndOr, propertyName: string, op: Operator, value: any, includeIfNull: boolean): this {
    if (value !== null && value !== undefined) {
      if (value === '*') {
        this._clauses.push([andOr, propertyName, ' IS ', 'NOT NULL']);
      } else {
        const operatorName = this.mapOperator(op);
        this._clauses.push([andOr, propertyName, operatorName, String(value)]);
      }
    } else if (includeIfNull) {
      this._clauses.push([andOr, propertyName, ' IS ', 'NULL']);
    }

    return this;
  }

  private mapOperator(op: Operator): string {
    switch (op) {
      case Operator.EQ:
        return '=';
      case Operator.GT:
        return '>';
      case Operator.GTE:
        return '>=';
      case Operator.LT:
        return '<';
      case Operator.LTE:
        return '<=';
      default:
        throw new Error(`Unsupported operator: ${op}`);
    }
  }

  public andChild(child: SearchSpecBuilder): this {
    return this.addChildClause(AndOr.And, child);
  }

  public orChild(child: SearchSpecBuilder): this {
    return this.addChildClause(AndOr.Or, child);
  }

  private addChildClause(andOr: AndOr, child: SearchSpecBuilder): this {
    const query = child.toString();
    if (query.trim()) {
      this._childClauses.push([andOr, query]);
    }
    return this;
  }

  public toString(): string {
    let addBrackets = false;

    const buildSearchSpec = (): string => {
      if (this._clauses.length === 0) return '';
      return this._clauses.reduce((result, [andOr, property, op, val], i) => {
        const clause = `${property}${op}${val}`.trim();
        return i === 0 ? clause : `${result} ${andOr} ${clause}`;
      }, '');
    };

    const appendChildClause = (root: string, [andOr, clause]: ChildClause): string => {
      if (!root) return clause;
      addBrackets = true;
      const bracketed = clause.startsWith('(') ? clause : `(${clause})`;
      return `${root} ${andOr} ${bracketed}`;
    };

    const spec = this._childClauses.reduce((root, clause) => appendChildClause(root, clause), buildSearchSpec());

    return spec && addBrackets ? `(${spec})` : spec;
  }
}
