import {
  mapperProperty,
  deepMapperProperty,
  filterMapperProperty,
  deserializeArr,
  deserialize,
  mock,
  serializeArr,
  serialize
} from '../src/index';
import { getRandomInt, getRandomString, getRandomFloat, formatDate } from '../src/lib/utils';

class Lesson {
  @mapperProperty('ClassName', 'string')
  public name: string;

  @mapperProperty('Teacher', 'string')
  public teacher: string;

  @mapperProperty('DateTime', 'datetime')
  public datetime: string;

  @mapperProperty('Date', 'date')
  public date: string;

  @mapperProperty('Time', 'time')
  public time: string;

  @mapperProperty('Compulsory', 'boolean')
  public compulsory: boolean;

  constructor() {
    this.name = '';
    this.teacher = '';
    this.datetime = '';
    this.date = '';
    this.time = '';
    this.compulsory = false;
  }
}

class Address {
  @mapperProperty('province', 'string')
  public province: string;
  @mapperProperty('city', 'string')
  public city: string;
  @mapperProperty('full_address', 'string')
  public fullAddress: string;

  constructor() {
    this.province = '';
    this.city = '';
    this.fullAddress = '';
  }
}

interface IStudent {
  StudentID?: string;
  StudentName?: string;
  StudentAge?: string;
  NotFloat?: string;
  NotANum?: string;
  UnknownType?: string;
  Grade?: string;
  AddressIds?: string[];
  Address?: any[];
  Lessons?: any[];
  State?: number;
}

class Student {
  @mapperProperty('StudentID', 'string')
  public id: string;

  @mapperProperty('StudentName', 'string')
  public name: string;

  @mapperProperty('StudentAge', 'int')
  public age: number;

  @mapperProperty('NotFloat', 'float')
  public notFloat: number;

  @mapperProperty('NotANum', 'int')
  public notNum: number;

  @mapperProperty('UnknownType', 'String')
  public unknownType: string;

  @mapperProperty('Grade', 'float')
  public grade: number;

  @mapperProperty('AddressIds', 'string')
  public addressIds?: string[];

  @deepMapperProperty('Address', Address)
  public address?: Address | null;

  @deepMapperProperty('Lessons', Lesson)
  public lessons?: Lesson[];

  @filterMapperProperty<IStudent>('State', (val = 0, row = {}) => {
    if (!(row.Lessons || []).length && val === 1) {
      return '实习中';
    }
    const map = { '0': '未知', '1': '读书中', '2': '辍学', '3': '毕业' };
    return map[`${val}`];
  })
  public status: string;

  public extra: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.age = 0;
    this.notNum = 0;
    this.notFloat = 0;
    this.unknownType = '';
    this.grade = 0;
    this.addressIds = [];
    this.address = null;
    this.lessons = [];
    this.status = '';
    this.extra = '';
  }
}

const Students = [
  {
    StudentID: '123456',
    StudentName: '李子明',
    StudentAge: '10',
    NotANum: 'lol',
    NotFloat: 'def',
    UnknownType: 'funny',
    Grade: '98.6',
    AddressIds: [1, 2],
    Address: {
      province: '广东',
      city: '深圳',
      full_address: 'xxx小学三年二班'
    },
    Lessons: [
      {
        ClassName: '中国上下五千年',
        Teacher: '建国老师',
        DateTime: 1609430399000,
        Date: 1609430399000,
        Time: 1609430399000,
        Compulsory: 1
      },
      {
        ClassName: '古筝的魅力',
        Teacher: '美丽老师',
        DateTime: ''
      }
    ],
    State: 1,
    extra: '额外信息'
  },
  {
    StudentID: '888888',
    StudentName: '丁仪',
    StudentAge: '18',
    Grade: null,
    Address: {
      province: '浙江',
      city: '杭州',
      full_address: 'xxx中学高三二班'
    },
    Lessons: [],
    State: 1
  }
];

const [first, second] = deserializeArr(Student, Students);

delete second.notFloat;

const [oriFirst] = serializeArr(Student, [first, second]);

const mockData1 = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 } });

const mockData2 = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 }, arrayFields: ['lessons'] });

describe('transformer', () => {
  test('name', () => {
    expect(first.id).toBe('123456');
  });

  test('type', () => {
    expect(second.age).toBe(18);
    expect(first.grade).toBeCloseTo(98.6);
    expect(second.grade).toBeNull();
  });

  test('sample', () => {
    const { addressIds = [] } = first;
    const [target] = addressIds;
    expect(typeof target).toBe('string');
  });

  test('deep', () => {
    const { address = { city: '' } } = first;
    expect(address?.city).toBe('深圳');
  });

  test('deep arr', () => {
    const { lessons = [] } = first;
    const [target] = lessons;
    expect(target.name).toBe('中国上下五千年');
  });
});

describe('filter', () => {
  test('inner', () => {
    const [target] = first.lessons || [];
    const times = 1609430399000;
    const datetime = formatDate(times);
    const date = formatDate(times, 'Y-M-D');
    const time = formatDate(times, 'h:m:s');
    expect(target.datetime).toBe(datetime);
    expect(target.date).toBe(date);
    expect(target.time).toBe(time);
    expect(first.status).toBe('读书中');
  });

  test('custom', () => {
    expect(second.status).toBe('实习中');
  });
});

describe('boundary', () => {
  test('do nothing', () => {
    expect(first.extra).toBe('额外信息');
  });

  test('deserialize first parameter illegal input', () => {
    let flag = 0;
    try {
      deserialize(null, {});
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/deserialize]: missing Clazz or json');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('deserialize second parameter illegal input', () => {
    let flag = 0;
    try {
      deserialize(Student, []);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/deserialize]: json is not a object');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('deserializeArr illegal input', () => {
    let flag = 0;
    try {
      deserializeArr(null, []);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/deserializeArr]: missing Clazz or list');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('serialize first parameter illegal input', () => {
    let flag = 0;
    try {
      serialize(null, {});
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/serialize]: missing Clazz or json');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('serialize second parameter illegal input', () => {
    let flag = 0;
    try {
      serialize(Student, []);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/serialize]: json is not a object');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('serializeArr illegal input', () => {
    let flag = 0;
    try {
      serializeArr(null, []);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/serializeArr]: missing Clazz or list');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('mock first parameter illegal input', () => {
    let flag = 0;
    try {
      mock(null);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/mock]: missing Clazz');
      flag = 2;
    }
    expect(flag).toBe(2);
  });

  test('mock second parameter illegal input', () => {
    let flag = 0;
    try {
      mock(Student, null);
      flag = 1;
    } catch (err) {
      flag = 2;
    }
    expect(flag).toBe(1);
  });
});

describe('serialize', () => {
  test('deep', () => {
    const { Lessons = [] } = oriFirst as any;
    const [target] = Lessons;
    const { ClassName } = target || {};
    expect(ClassName).toBe('中国上下五千年');
  });
  test('array', () => {
    const { AddressIds = [] } = oriFirst as any;
    const [target] = AddressIds;
    expect(target).toBe('1');
  });
});

describe('mock', () => {
  test('generate', () => {
    expect(mockData1.name.length).toBe(6);
  });

  test('generate arr', () => {
    expect(Object.prototype.toString.call(mockData1.lessons)).toBe('[object Object]');
    expect(Object.prototype.toString.call(mockData2.lessons)).toBe('[object Array]');
  });
});

describe('tools', () => {
  test('illegal parameters', () => {
    // @ts-ignore
    const num = getRandomInt();
    expect(num).toBe(0);

    // @ts-ignore
    const string = getRandomString();
    expect(string).toBe('');

    // @ts-ignore
    const float = getRandomFloat();
    expect(float).toBe(0);
  });
});
