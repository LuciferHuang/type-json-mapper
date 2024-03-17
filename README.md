# type-json-mapper

[![codecov](https://codecov.io/gh/LuciferHuang/type-json-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/LuciferHuang/type-json-mapper)

## Introduction

Instead of directly using api data, we definitely require an adapter layer to transform data as needed. Furthermore, the adapter inverse the the data dependency from API server(API Server is considered uncontrollable and highly unreliable as data structure may be edit by backend coder for some specific purposes)to our adapter which becomes reliable. Thus, this library is created as the adapter. It also supports mock data.

## Doc

[中文文档](https://juejin.cn/post/7221497108008419388)

## Get Started

```bash
npm install type-json-mapper --save
```

## Example

Here is a complex example, hopefully could give you an idea of how to use it:

```typescript
import { mapperProperty, deepMapperProperty, filterMapperProperty } from "type-json-mapper";

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

  @mapperProperty('UnknownType', 'String')
  public unknownType: string;

  @mapperProperty('Grade', 'float')
  public grade: number;

  @mapperProperty('AddressIds', 'string')
  public addressIds?: string[];

  @deepMapperProperty('Address', Address)
  public address?: Address;

  @deepMapperProperty('Lessons', Lesson)
  public lessons?: Lesson[];

  @filterMapperProperty('State', (val = 0) => {
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
```

Now here is what API server return, assume it is already parsed to JSON object.

```typescript
const json = {
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
  }
```

### Deserialize

Simply, just map it use following code. 

```typescript
import { deserialize } from 'type-json-mapper';
try {
  const student = deserialize(Student, json);
  console.log(student);
} catch(err) {
  console.error(err);
}
```

the result

```ts
{
  id: '123456',
  name: '李子明',
  age: 10,
  notNum: 'lol',
  notFloat: 'def',
  unknownType: 'funny',
  grade: 98.6,
  addressIds: ['1', '2'],
  address: { province: '广东', city: '深圳', fullAddress: 'xxx小学三年二班' },
  lessons: [
    {
      name: '中国上下五千年',
      teacher: '建国老师',
      datetime: '2020-12-31 23:59:59',
      date: '2020-12-31',
      time: '23:59:59',
      compulsory: true
    },
    {
      name: '古筝的魅力',
      teacher: '美丽老师',
      datetime: '',
      date: undefined,
      time: undefined,
      compulsory: undefined
    }
  ],
  status: '读书中',
  extra: '额外信息'
}
```

### Serialize

```typescript
import { serialize } from 'type-json-mapper';
try {
  const params = serialize(Student, student);
  console.log(params);
} catch(err) {
  console.error(err);
}
```

```typescript
{
  StudentID: '123456',
  StudentName: '李子明',
  StudentAge: 10,
  NotANum: 'lol',
  NotFloat: 'def',
  UnknownType: 'funny',
  Grade: 98.6,
  AddressIds: [ '1', '2' ],
  Address: { province: '广东', city: '深圳', full_address: 'xxx小学三年二班' },
  Lessons: [
    {
      ClassName: '中国上下五千年',
      Teacher: '建国老师',
      DateTime: '2020-12-31 23:59:59',
      Date: '2020-12-31',
      Time: '23:59:59',
      Compulsory: true
    },
    { ClassName: '古筝的魅力', Teacher: '美丽老师', DateTime: '' }
  ],
  State: '读书中',
  extra: '额外信息'
}
```

### Mock data

```typescript
import { mock } from 'type-json-mapper';
const res = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 }, arrayFields: ['lessons'] });
console.dir(res);
```

```js
{
  id: 'uBP2ug',
  name: 'EmcuTs',
  age: 7,
  notNum: 4,
  notFloat: 624.775,
  unknownType: '',
  grade: 537.3,
  addressIds: 'cjcpoC',
  address: { province: '1VSl9Z', city: 'tCtF9K', fullAddress: 'Ves3rZ' },
  lessons: [
    {
      name: 'm2WqeY',
      teacher: 'UdIuLT',
      datetime: '2024-03-17 03:54:59',
      date: '2024-03-17',
      time: '03:54:59',
      compulsory: false
    },
    {
      name: 'dCEoGG',
      teacher: 'gJrmkV',
      datetime: '2024-03-17 03:54:59',
      date: '2024-03-17',
      time: '03:54:59',
      compulsory: false
    },
    {
      name: 'JDVZqP',
      teacher: 'dV8ITf',
      datetime: '2024-03-17 03:54:59',
      date: '2024-03-17',
      time: '03:54:59',
      compulsory: false
    }
  ],
  status: '未知',
  extra: ''
}
```

**Make sure the decorator is assigned a type**

## Test

```bash
npm run test
```
