# type-json-mapper

[![codecov](https://codecov.io/gh/LuciferHuang/type-json-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/LuciferHuang/type-json-mapper)

## Introduction

Instead of directly using api data, we definitely require an adapter layer to transform data as needed. Furthermore, the adapter inverse the the data dependency from API server(API Server is considered uncontrollable and highly unreliable as data structure may be edit by backend coder for some specific purposes)to our adapter which becomes reliable. Thus, this library is created as the adapter. It also supports mock data.

## Doc

[中文文档](https://mp.weixin.qq.com/s/YVOYZHTDbAfwcGaUUMld0Q)

## Get Started

```bash
npm install type-json-mapper --save
```

## Example

Here is a complex example, hopefully could give you an idea of how to use it:

```typescript
import { mapperProperty, deepMapperProperty, filterMapperProperty } from "type-json-mapper";

class Lesson {
  @mapperProperty("ClassName", "string")
  public name: string;
  @mapperProperty("Teacher", "string")
  public teacher: string;
  @mapperProperty("DateTime", "datetime")
  public datetime: string;

  constructor() {
    this.name = "";
    this.teacher = "";
    this.datetime = "";
  }
}

class Address {
  public province: string;
  public city: string;
  @mapperProperty("full_address", "string")
  public fullAddress: string;

  constructor() {
    this.province = "";
    this.city = "";
    this.fullAddress = "";
  }
}

class Student {
  @mapperProperty("StudentID", "string")
  public id: string;
  @mapperProperty("StudentName", "string")
  public name: string;
  @mapperProperty("StudentAge", "int")
  public age: number;
  @filterMapperProperty("StudentSex", (val = 0) => {
    const map = { 0: '保密' 1: '男生', 2: '女生'};
    return map[val];
  })
  public sex: string;
  @deepMapperProperty("Address", Address)
  public address?: Address;
  @deepMapperProperty("Lessons", Lesson)
  public lessons?: Lesson[];

  constructor() {
    this.id = "";
    this.name = "";
    this.age = 0;
    this.sex = 0;
    this.address = undefined;
    this.lessons = undefined;
  }
}
```

Now here is what API server return, assume it is already parsed to JSON object.

```typescript
let json = {
  StudentID: "123456",
  StudentName: "李子明",
  StudentAge: "9",
  StudentSex: "1",
  Address: {
    province: "广东",
    city: "深圳",
    full_address: "xxx小学三年二班",
  },
  Lessons: [
    {
      ClassName: "中国上下五千年",
      Teacher: "建国老师",
      DateTime: 1609430399000,
    },
  ],
};
```

Simply, just map it use following code. 

```typescript
import { deserialize } from 'type-json-mapper';
try {
  const student = deserialize(Student, json);
  console.dir(student);
} catch(err) {
  console.error(err);
}
```

![result.png](https://i.loli.net/2021/04/09/kPJW6Nn5gduBZXq.png)

Mock data

```typescript
import { mock } from 'type-json-mapper';
const res = mock(Student, { fieldLength: { age: 20, grade: 4, name: 6 }, arrayFields: ['lessons'] });
console.dir(res);
```

```js
// console.dir(res);
{
  id: 'QGBLBA',
  name: 'KTFH6d',
  age: 4,
  sex: '保密',
  grade: 76.15,
  address: { province: 'qvbCte', city: 'DbHfFZ', fullAddress: 'BQ4uIL' },
  lessons: [
    {
      name: 'JDtNMx',
      teacher: 'AeI6hB',
      datetime: '2023-2-18 15:00:07',
      date: '2023-2-18',
      time: '15:00:07',
      compulsory: true
    },
    {
      name: 'BIggA8',
      teacher: '8byaId',
      datetime: '2023-2-18 15:00:07',
      date: '2023-2-18',
      time: '15:00:07',
      compulsory: false
    },
    {
      name: 'pVda1n',
      teacher: 'BPCmwa',
      datetime: '2023-2-18 15:00:07',
      date: '2023-2-18',
      time: '15:00:07',
      compulsory: false
    }
  ],
  status: '',
  position: '',
  extra: ''
}
```

**Make sure the decorator is assigned a type**

## Test

```bash
npm run test
```
