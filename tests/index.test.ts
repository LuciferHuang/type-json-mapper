import { mapperProperty, deepMapperProperty, filterMapperProperty, deserializeArr, deserialize, mock } from '../src/index';
import { getRandomInt, getRandomString, getRandomFloat } from '../src/lib/utils';

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
  // @ts-ignore
  @mapperProperty('UnknownType', 'String')
  public unknownType: string;
  @filterMapperProperty('StudentSex', (val = 0) => {
    const map = { 0: '未知', 1: '男生', 2: '女生' };
    return map[val];
  })
  public sex: string;
  @mapperProperty('Grade', 'float')
  public grade: number;
  @deepMapperProperty('Address', Address)
  public address?: Address;
  @deepMapperProperty('Lessons', Lesson)
  public lessons?: Lesson[];
  @filterMapperProperty('State', (val = 0) => {
    const map = { '0': '未知', '1': '读书中', '2': '辍学', '3': '毕业' };
    return map[`${val}`];
  })
  // @ts-ignore
  public status: string;
  public extra: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.age = 0;
    this.notNum = 0;
    this.notFloat = 0;
    this.sex = '';
    this.unknownType = '';
    this.grade = 0;
    this.address = undefined;
    this.lessons = undefined;
    this.status = '';
    this.extra = '';
  }
}

const Students = [
  {
    StudentID: '123456',
    StudentName: '李子明',
    StudentAge: '10',
    StudentSex: 1,
    NotANum: 'lol',
    NotFloat: 'def',
    UnknownType: 'funny',
    Grade: '98.6',
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
    StudentSex: 2,
    Grade: null,
    Address: {
      province: '浙江',
      city: '杭州',
      full_address: 'xxx中学高三二班'
    },
    Lessons: [],
    State: 2
  }
];

const [first, second] = deserializeArr(Student, Students);

describe('transformer', () => {
  test('name', () => {
    expect(first.id).toBe('123456');
  });

  test('type', () => {
    expect(second.age).toBe(18);
    expect(first.grade).toBeCloseTo(98.6);
    expect(second.grade).toBeNull();
  });

  test('deep', () => {
    const { address = { city: '' } } = first;
    expect(address.city).toBe('深圳');
  });
});

describe('filter', () => {
  test('inner', () => {
    const [target] = first.lessons || [];
    expect(target.datetime).toBe('2020-12-31 23:59:59');
    expect(target.date).toBe('2020-12-31');
    expect(target.time).toBe('23:59:59');
  });

  test('custom', () => {
    expect(first.sex).toBe('男生');
    expect(second.status).toBe('辍学');
  });
});

describe('boundary', () => {
  test('do nothing', () => {
    expect(first.extra).toBe('额外信息');
  });

  test('deserialize first parameter illegal input', () => {
    let flag = 0;
    try {
      // @ts-ignore
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
      // @ts-ignore
      deserializeArr(null, []);
      flag = 1;
    } catch (err) {
      expect(err.message).toBe('[type-json-mapper/deserializeArr]: missing Clazz or list');
      flag = 2;
    }
    expect(flag).toBe(2);
  });
});

describe('mock', () => {
  test('generate', () => {
    const res = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 }, arrayFields: ['lessons'] });
    expect(res.name.length).toBe(6);
    expect(Object.prototype.toString.call(res.lessons)).toBe('[object Array]');
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
