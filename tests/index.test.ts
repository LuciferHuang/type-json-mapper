import { mapperProperty, deepMapperProperty, filterMapperProperty, deserializeArr, deserialize, mock } from '../src/index';

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

const stateMap = { '1': '读书中', '2': '辍学', '3': '毕业' };

class Student {
  @mapperProperty('StudentID', 'string')
  public id: string;
  @mapperProperty('StudentName', 'string')
  public name: string;
  @mapperProperty('StudentAge', 'int')
  public age: number;
  @mapperProperty('StudentSex', 'string')
  public sex: string;
  @mapperProperty('Grade', 'float')
  public grade: number;
  @deepMapperProperty('Address', Address)
  public address?: Address;
  @deepMapperProperty('Lessons', Lesson)
  public lessons?: Lesson[];
  @filterMapperProperty('State', (val: number) => stateMap[`${val}`])
  public status: string;
  @filterMapperProperty('Position', (val: number) => stateMap[`${val}`])
  public position: string;
  public extra: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.age = 0;
    this.sex = '';
    this.grade = 0;
    this.address = undefined;
    this.lessons = undefined;
    this.status = '';
    this.position = '';
    this.extra = '';
  }
}

const Students = [
  {
    StudentID: '123456',
    StudentName: '李子明',
    StudentAge: '10',
    StudentSex: 1,
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
    Position: 123,
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

test('name trans: StudentID 2 id', () => {
  expect(first.id).toBe('123456');
});

test('type trans', () => {
  expect(second.age).toBe(18);
  expect(first.sex).toBe('1');
  expect(first.grade).toBe(98.6);
  expect(second.grade).toBe(null);
});

test('deep trans: Address 2 address', () => {
  const { address = { city: '' } } = first;
  expect(address.city).toBe('深圳');
});

test('inner filter', () => {
  const [target] = first.lessons || [];
  expect(target.datetime).toBe('2020-12-31 23:59:59');
  expect(target.date).toBe('2020-12-31');
  expect(target.time).toBe('23:59:59');
  expect(second.lessons.length).toBe(0);
});

test('custom filter', () => {
  expect(first.position).toBe(123);
  expect(second.status).toBe('辍学');
});

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

test('mock', () => {
  const res = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 }, arrayFields: ['lessons'] });
  expect(res.name.length).toBe(6);
  expect(Object.prototype.toString.call(res.lessons)).toBe('[object Array]');
});
